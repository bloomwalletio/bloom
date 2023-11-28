export abstract class BaseApi {
    private readonly _baseUrl: string

    protected constructor(baseUrl: string) {
        this._baseUrl = baseUrl
    }

    protected get<T>(path: string): Promise<T> {
        return this.makeRequest<T>(path)
    }

    protected ost<T>(path: string, body: string): Promise<T> {
        return this.makeRequest<T>(path, body)
    }

    private async makeRequest<T>(path: string, body?: string): Promise<T> {
        const requestInit: RequestInit = {
            method: body ? 'POST' : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            ...(body && { body }),
        }
        const response = await fetch(`${this._baseUrl}/${path}`, requestInit)
        return (await response.json()) as T
    }
}
