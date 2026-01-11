import { MarketGrpcClient, MarketErrors } from '@infra/api/http/marketGrpcClient';

const mockGetSession = jest.fn();

jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      getSession: (...args: any[]) => mockGetSession(...args),
    },
  },
}));

type XhrHandler = {
  method: string;
  url: string;
  body?: any;
  headers: Record<string, string>;
  respond: (status: number, responseText: string) => void;
  progress: (responseText: string) => void;
  complete: (status: number, responseText?: string) => void;
};

class FakeXMLHttpRequest {
  static instances: FakeXMLHttpRequest[] = [];
  static handlersQueue: ((xhr: FakeXMLHttpRequest) => void)[] = [];

  method = '';
  url = '';
  async = true;

  status = 0;
  responseText = '';

  readyState = 0;

  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;
  onprogress: null | (() => void) = null;
  onreadystatechange: null | (() => void) = null;

  private headers: Record<string, string> = {};
  private sentBody: any;

  constructor() {
    FakeXMLHttpRequest.instances.push(this);
  }

  open(method: string, url: string, async = true) {
    this.method = method;
    this.url = url;
    this.async = async;
  }

  setRequestHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  send(body: any) {
    this.sentBody = body;

    const next = FakeXMLHttpRequest.handlersQueue.shift();
    if (next) next(this);
  }

  abort() {}

  __getHeaders() {
    return this.headers;
  }

  __getSentBody() {
    return this.sentBody;
  }

  __respond(status: number, text: string) {
    this.status = status;
    this.responseText = text;
    this.onload?.();
  }

  __progress(text: string) {
    // Para streaming simulamos que responseText se va acumulando
    this.responseText = text;
    this.onprogress?.();
  }

  __complete(status: number, text = '') {
    this.status = status;
    this.responseText = text;
    this.readyState = 4;
    this.onreadystatechange?.();
  }
}

describe('MarketGrpcClient (Integration)', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    process.env = {
      ...OLD_ENV,
      EXPO_PUBLIC_API_GATEWAY_URL: 'https://gateway.test',
    };

    (global as any).XMLHttpRequest = jest.fn(() => new FakeXMLHttpRequest());
    FakeXMLHttpRequest.instances = [];
    FakeXMLHttpRequest.handlersQueue = [];

    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'token-123' } },
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('buy() should POST with Authorization header and return parsed JSON', async () => {
    const client = new MarketGrpcClient('https://gateway.test');

    FakeXMLHttpRequest.handlersQueue.push((xhr) => {
      expect(xhr.method).toBe('POST');
      expect(xhr.url).toBe('https://gateway.test/api/market/buy/');

      const headers = xhr.__getHeaders();
      expect(headers.Authorization).toBe('Bearer token-123');
      expect(headers['Content-Type']).toBe('application/json');

      const body = JSON.parse(xhr.__getSentBody());
      expect(body.teamPublicId).toBe('team-1');

      xhr.__respond(200, JSON.stringify({ ok: true }));
    });

    const res = await client.buy({ teamPublicId: 'team-1', userPublicId: 'u', assetPublicId: 'a', quantity: 1 });
    expect(res).toEqual({ ok: true });
  });

  it('sell() should throw INVALID_QUANTITY if quantity <= 0', async () => {
    const client = new MarketGrpcClient('https://gateway.test');

    await expect(
      client.sell({ teamPublicId: 'team-1', userPublicId: 'u', assetPublicId: 'a', quantity: 0 })
    ).rejects.toThrow('INVALID_QUANTITY');
  });

  it('sell() should throw ASSET_NOT_OWNED if portfolio has no position', async () => {
    const client = new MarketGrpcClient('https://gateway.test');

    // 1) GET portfolio
    FakeXMLHttpRequest.handlersQueue.push((xhr) => {
      expect(xhr.method).toBe('GET');
      expect(xhr.url).toContain('/api/portfolio/assets/team/team-1/user/u');

      xhr.__respond(200, JSON.stringify([{ assetId: 'other', quantity: 5 }]));
    });

    await expect(
      client.sell({ teamPublicId: 'team-1', userPublicId: 'u', assetPublicId: 'a', quantity: 1 })
    ).rejects.toThrow(MarketErrors.ASSET_NOT_OWNED);
  });

  it('sell() should throw INSUFFICIENT_ASSET_QUANTITY if portfolio quantity < requested', async () => {
    const client = new MarketGrpcClient('https://gateway.test');

    // 1) GET portfolio
    FakeXMLHttpRequest.handlersQueue.push((xhr) => {
      xhr.__respond(200, JSON.stringify([{ assetId: 'a', quantity: 1 }]));
    });

    await expect(
      client.sell({ teamPublicId: 'team-1', userPublicId: 'u', assetPublicId: 'a', quantity: 2 })
    ).rejects.toThrow(MarketErrors.INSUFFICIENT_ASSET_QUANTITY);
  });

  it('sell() should GET portfolio, then POST sell', async () => {
    const client = new MarketGrpcClient('https://gateway.test');

    // 1) GET portfolio
    FakeXMLHttpRequest.handlersQueue.push((xhr) => {
      expect(xhr.method).toBe('GET');
      xhr.__respond(200, JSON.stringify([{ assetId: 'a', quantity: 10 }]));
    });

    // 2) POST sell
    FakeXMLHttpRequest.handlersQueue.push((xhr) => {
      expect(xhr.method).toBe('POST');
      expect(xhr.url).toBe('https://gateway.test/api/market/sell/');
      const headers = xhr.__getHeaders();
      expect(headers.Authorization).toBe('Bearer token-123');

      xhr.__respond(200, JSON.stringify({ ok: 'sold' }));
    });

    const res = await client.sell({
      teamPublicId: 'team-1',
      userPublicId: 'u',
      assetPublicId: 'a',
      quantity: 2,
      price: 100,
    });

    expect(res).toEqual({ ok: 'sold' });
  });

  it('streamMarket() should parse multiple JSON objects from chunks and call onComplete()', async () => {
    const client = new MarketGrpcClient('https://gateway.test');
    const onMessage = jest.fn();
    const onComplete = jest.fn();
    const onError = jest.fn();

    // Cuando se llame send(null) del streaming, simulamos progresos y completion.
    FakeXMLHttpRequest.handlersQueue.push((xhr) => {
      // chunk 1: JSON incompleto
      xhr.__progress('{"Timestamp":1,"Assets":[{"Id":"a","Price":10}]}{"Timestamp":2');
      // chunk 2: completa el segundo JSON
      xhr.__progress('{"Timestamp":1,"Assets":[{"Id":"a","Price":10}]}{"Timestamp":2,"Assets":[{"Id":"b","Price":20}]}');
      // complete OK
      xhr.__complete(200, '');
    });

    const unsubscribe = client.streamMarket('team-1', { onMessage, onComplete, onError });

    // Espera microtasks del async IIFE interno
    await Promise.resolve();
    await Promise.resolve();

    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenNthCalledWith(1, expect.objectContaining({ Timestamp: 1 }));
    expect(onMessage).toHaveBeenNthCalledWith(2, expect.objectContaining({ Timestamp: 2 }));
    expect(onComplete).toHaveBeenCalledTimes(1);

    unsubscribe();
  });
});
