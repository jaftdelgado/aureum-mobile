import { supabase } from "@infra/external/supabase";

const GATEWAY_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL;

type StreamHandlers<T> = {
  onMessage: (msg: T) => void;
  onError?: (err: Error) => void;
  onComplete?: () => void;
};

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

function extractJsonObjects(buffer: string): { objects: string[]; rest: string } {
  const objs: string[] = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = 0; i < buffer.length; i++) {
    const ch = buffer[i];

    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
      continue;
    }

    if (ch === "}") {
      if (depth > 0) depth--;
      if (depth === 0 && start !== -1) {
        objs.push(buffer.slice(start, i + 1));
        start = -1;
      }
      continue;
    }
  }

  const rest =
    depth > 0 && start !== -1
      ? buffer.slice(start)
      : buffer.slice(buffer.lastIndexOf("}") + 1);

  return { objects: objs, rest };
}

export class MarketGrpcClient {
  private baseUrl: string;

  constructor(baseUrl = GATEWAY_URL ?? "") {
    if (!baseUrl) {
      throw new Error("EXPO_PUBLIC_API_GATEWAY_URL no está definido. Revisa tu .env");
    }
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private tradeUrl(path: "buy" | "sell") {
    return `${this.baseUrl}/api/market/${path}/`;
  }

  async buy<T = any>(body: unknown) {
    return this.postJson<T>(this.tradeUrl("buy"), body, "Buy");
  }

  async sell<T = any>(body: unknown) {
    return this.postJson<T>(this.tradeUrl("sell"), body, "Sell");
  }

  private async postJson<T = any>(url: string, body: unknown, label: string): Promise<T> {
    const token = await getAccessToken();

    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Accept", "application/json");
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.onload = () => {
        const status = xhr.status ?? 0;
        const text = xhr.responseText ?? "";

        if (status >= 200 && status < 300) {
          try {
            resolve(text ? (JSON.parse(text) as T) : ({} as T));
          } catch {
            resolve((text as unknown) as T);
          }
          return;
        }

        reject(new Error(`${label} failed: ${status} ${text}`));
      };

      xhr.onerror = () => reject(new Error(`${label} failed: XHR network error`));

      try {
        xhr.send(JSON.stringify(body));
      } catch (e: any) {
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    });
  }

  streamMarket<T>(teamPublicId: string, handlers: StreamHandlers<T>): () => void {
    const xhr = new XMLHttpRequest();
    let lastIndex = 0;
    let buffer = "";
    let closed = false;

    const url = `${this.baseUrl}/api/market/stream/${teamPublicId}`;

    (async () => {
      try {
        const token = await getAccessToken();

        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json");
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onreadystatechange = () => {
          if (closed) return;

          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              handlers.onComplete?.();
            } else {
              handlers.onError?.(
                new Error(
                  `Stream failed: ${xhr.status} ${xhr.responseText?.slice?.(0, 200) ?? ""}`
                )
              );
            }
          }
        };

        xhr.onerror = () => {
          if (closed) return;
          handlers.onError?.(new Error("XHR stream error"));
        };

        xhr.onprogress = () => {
          if (closed) return;

          const text = xhr.responseText || "";
          if (text.length <= lastIndex) return;

          const chunk = text.slice(lastIndex);
          lastIndex = text.length;

          buffer += chunk;

          const { objects, rest } = extractJsonObjects(buffer);
          buffer = rest;

          for (const obj of objects) {
            try {
              handlers.onMessage(JSON.parse(obj) as T);
            } catch {
            }
          }
        };

        xhr.send(null);
      } catch (e: any) {
        if (closed) return;
        handlers.onError?.(e instanceof Error ? e : new Error(String(e)));
      }
    })();

    return () => {
      closed = true;
      try {
        xhr.abort();
      } catch {}
    };
  }
}
