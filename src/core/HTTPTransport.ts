enum METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

function queryStringify(data: Record<string, unknown>): string {
    if (typeof data !== "object" || data === null) {
        throw new Error("Data must be object");
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        return `${result}${key}=${encodeURIComponent(
            String(data[key])
        )}${index < keys.length - 1 ? "&" : ""}`;
    }, "?");
}

type Options = {
    method?: METHODS;
    headers?: Record<string, string>;
    data?: XMLHttpRequestBodyInit | Record<string, unknown>;
    timeout?: number;
};

class HTTPTransport {
    get<T = unknown>(url: string, options: Omit<Options, "method"> = {}): Promise<T> {
        return this.request<T>(url, { ...options, method: METHODS.GET }, options.timeout);
    }

    post<T = unknown>(url: string, options: Omit<Options, "method"> = {}): Promise<T> {
        return this.request<T>(url, { ...options, method: METHODS.POST }, options.timeout);
    }

    put<T = unknown>(url: string, options: Omit<Options, "method"> = {}): Promise<T> {
        return this.request<T>(url, { ...options, method: METHODS.PUT }, options.timeout);
    }

    delete<T = unknown>(url: string, options: Omit<Options, "method"> = {}): Promise<T> {
        return this.request<T>(url, { ...options, method: METHODS.DELETE }, options.timeout);
    }

    request<T = unknown>(url: string, options: Options = {}, timeout = 5000): Promise<T> {
        const { headers = {}, method, data } = options;

        return new Promise<T>((resolve, reject) => {
            if (!method) {
                reject(new Error("No method"));
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;

            xhr.open(
                method,
                isGet && data && typeof data === "object"
                    ? `${url}${queryStringify(data as Record<string, unknown>)}`
                    : url
            );

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = () => {
                try {
                    // Пытаемся парсить JSON, иначе вернём raw response
                    const response = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                    resolve(response as T);
                } catch {
                    resolve(xhr.response as T);
                }
            };

            xhr.onabort = () => reject(new Error("Request aborted"));
            xhr.onerror = () => reject(new Error("Network error"));
            xhr.ontimeout = () => reject(new Error("Request timed out"));

            xhr.timeout = timeout;

            if (isGet || !data) {
                xhr.send();
            } else {
                if (data instanceof Document || typeof data !== "object") {
                    xhr.send(data as XMLHttpRequestBodyInit);
                } else {
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify(data));
                }
            }
        });
    }
}

export default HTTPTransport;
