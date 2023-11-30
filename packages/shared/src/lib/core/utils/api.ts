export class BaseApi {
    private readonly _baseUrl: string

    constructor(baseUrl: string) {
        this._baseUrl = baseUrl
    }

    protected get<T>(path: string, options?: IApiRequestOptions): Promise<T | undefined> {
        return this.makeRequest<T>(path, '', options)
    }

    protected post<T>(path: string, body: string, options?: IApiRequestOptions): Promise<T | undefined> {
        return this.makeRequest<T>(path, body, options)
    }

    private async makeRequest<T>(path: string, body?: string, options?: IApiRequestOptions): Promise<T | undefined> {
        try {
            const requestInit: RequestInit = {
                method: body ? 'POST' : 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                ...(body && { body }),
                ...(options?.disableCors && { mode: 'no-cors' }),
            }
            const response = await fetch(`${this._baseUrl}/${path}`, requestInit)
            return (await response.json()) as T
        } catch (err) {
            // Do nothing.
        }
    }
}

export interface IApiRequestOptions {
    disableCors?: boolean
}
