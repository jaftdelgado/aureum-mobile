import { HttpClient, axiosInstance } from '@infra/api/http/client';
import { supabase } from '@infra/external/supabase';
import { emitLogout, emitServerDisconnect } from '@app/events/authEvents';

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      defaults: { headers: { common: {} } },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      request: jest.fn(),
      get: jest.fn(),
    })),
    isAxiosError: jest.fn((payload) => !!payload?.isAxiosError),
  };
});

jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('@app/events/authEvents', () => ({
  emitLogout: jest.fn(),
  emitServerDisconnect: jest.fn(),
}));

describe('Infrastructure: HttpClient & Axios Interceptors', () => {
  let client: HttpClient;

  let requestInterceptor: any;
  let responseInterceptor: any;
  let responseErrorInterceptor: any;
  let mockAxiosRequest: jest.Mock;
  let mockAxiosGet: jest.Mock;

  beforeAll(() => {
    const reqMock = axiosInstance.interceptors.request.use as jest.Mock;
    const resMock = axiosInstance.interceptors.response.use as jest.Mock;

    requestInterceptor = reqMock.mock.calls[0][0];
    responseInterceptor = resMock.mock.calls[0][0];
    responseErrorInterceptor = resMock.mock.calls[0][1];
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosRequest = axiosInstance.request as jest.Mock;
    mockAxiosGet = axiosInstance.get as jest.Mock;
    client = new HttpClient(axiosInstance);
  });

  describe('Axios Interceptors', () => {
    
    it('Request Interceptor: should inject Bearer token if session exists', async () => {
      const mockToken = 'super-secret-token';
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({ 
        data: { session: { access_token: mockToken } }, 
        error: null 
      });

      const config = { headers: {} };
      await requestInterceptor(config);

      expect(config.headers).toHaveProperty('Authorization', `Bearer ${mockToken}`);
    });

    it('Request Interceptor: should throw 401 if no session exists', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({ 
        data: { session: null }, 
        error: null 
      });

      const config = { headers: {} };

      await expect(requestInterceptor(config)).rejects.toThrow('No session active');
      await expect(requestInterceptor(config)).rejects.toMatchObject({ status: 401 });
    });

    it('Response Interceptor (Error): should emitLogout on 401 response', async () => {
      const error401 = { response: { status: 401 } };

      try {
        await responseErrorInterceptor(error401);
      } catch (e) {
      }

      expect(emitLogout).toHaveBeenCalled();
    });

    it('Response Interceptor (Error): should NOT emitLogout on other errors', async () => {
      const error500 = { response: { status: 500 } };
      try { await responseErrorInterceptor(error500); } catch (e) {}
      expect(emitLogout).not.toHaveBeenCalled();
    });
  });

  describe('HttpClient Methods', () => {

    it('should call axios.request with correct parameters for GET', async () => {
      mockAxiosRequest.mockResolvedValue({ data: { success: true } });
      
      const result = await client.get('/users', { page: '1' });

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/users',
        params: { page: '1' },
        headers: undefined,
        data: undefined,
      });
      expect(result).toEqual({ success: true });
    });

    it('should call axios.request with correct parameters for POST', async () => {
      mockAxiosRequest.mockResolvedValue({ data: { id: 1 } });
      
      const payload = { name: 'Juan' };
      const headers = { 'X-Custom': 'Value' };
      await client.post('/users', payload, { headers });

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/users',
        data: payload,
        params: undefined,
        headers: headers
      });
    });

    it('should call axios.request with correct parameters for PUT', async () => {
        mockAxiosRequest.mockResolvedValue({ data: { updated: true } });
        
        const payload = { role: 'admin' };
        await client.put('/users/1', payload);
  
        expect(mockAxiosRequest).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/users/1',
          data: payload,
          params: undefined,
          headers: undefined
        });
      });
  
      it('should call axios.request with correct parameters for PATCH', async () => {
        mockAxiosRequest.mockResolvedValue({ data: { patched: true } });
        
        const payload = { name: 'Juan Updated' };
        await client.patch('/users/1', payload);
  
        expect(mockAxiosRequest).toHaveBeenCalledWith({
          method: 'PATCH',
          url: '/users/1',
          data: payload,
          params: undefined,
          headers: undefined
        });
      });
  
      it('should call axios.request with correct parameters for DELETE', async () => {
        mockAxiosRequest.mockResolvedValue({ data: { deleted: true } });
        
        await client.delete('/users/1');
  
        expect(mockAxiosRequest).toHaveBeenCalledWith({
          method: 'DELETE',
          url: '/users/1',
          data: undefined,
          params: undefined,
          headers: undefined
        });
      });
  });

  describe('Error Handling Logic', () => {

    const createAxiosError = (status: number, data: any, message = 'Axios Error', code?: string) => ({
      isAxiosError: true,
      message,
      code,
      response: status ? { status, data } : undefined,
    });

    it('should extract error message from "detail" field', async () => {
      const error = createAxiosError(400, { detail: 'Email invalid' });
      mockAxiosRequest.mockRejectedValue(error);

      await expect(client.get('/test')).rejects.toMatchObject({
        status: 400,
        message: 'Email invalid'
      });
    });

    it('should extract error message from "message" field', async () => {
      const error = createAxiosError(404, { message: 'Not Found' });
      mockAxiosRequest.mockRejectedValue(error);

      await expect(client.get('/test')).rejects.toThrow('Not Found');
    });

    it('should stringify object errors in "detail"', async () => {
      const complexError = { field: 'password', issue: 'too_short' };
      const error = createAxiosError(400, { detail: complexError });
      mockAxiosRequest.mockRejectedValue(error);

      try {
        await client.get('/test');
      } catch (e: any) {
        expect(e.message).toContain('too_short'); 
        expect(e.status).toBe(400);
      }
    });

    it('should handle Server Errors (500+) by emitting ServerDisconnect', async () => {
      const error = createAxiosError(503, { message: 'Service Unavailable' });
      mockAxiosRequest.mockRejectedValue(error);

      await expect(client.get('/test')).rejects.toThrow('Servidor no disponible');
      expect(emitServerDisconnect).toHaveBeenCalled();
    });

    it('should handle Timeouts (ECONNABORTED)', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const error = createAxiosError(0, null, 'timeout of 1500ms exceeded', 'ECONNABORTED');
      mockAxiosRequest.mockRejectedValue(error);

      await expect(client.get('/test')).rejects.toMatchObject({
        status: 408,
        message: expect.stringContaining('tardó demasiado')
      });

      consoleSpy.mockRestore();
    });

    it('should handle Network Errors (No response) by emitting ServerDisconnect', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const error = createAxiosError(0, undefined, 'Network Error'); 
      mockAxiosRequest.mockRejectedValue(error);

      await expect(client.get('/test')).rejects.toMatchObject({
        status: 0,
        message: 'Error de conexión'
      });
      expect(emitServerDisconnect).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('getBlob', () => {
    it('should return a Blob on success', async () => {
      const mockBlob = new Blob(['test']);
      mockAxiosGet.mockResolvedValue({ data: mockBlob });

      const result = await client.getBlob('/file.pdf');
      
      expect(mockAxiosGet).toHaveBeenCalledWith('/file.pdf', { responseType: 'blob' });
      expect(result).toBe(mockBlob);
    });

    it('should handle timeout in getBlob', async () => {
       const error = { code: 'ECONNABORTED', isAxiosError: true };
       mockAxiosGet.mockRejectedValue(error);

       await expect(client.getBlob('/file')).rejects.toThrow('Tiempo de descarga agotado');
    });
  });
});