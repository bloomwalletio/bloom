import { QueryParameters } from './types'
import { buildQueryParametersFromObject } from './url'

interface IApiRequestOptions {
    disableCors?: boolean
}

export class BaseApi {
    private readonly _baseUrl: string

    constructor(baseUrl: string) {
        this._baseUrl = baseUrl
    }

    protected get<T>(
        path: string,
        queryParameters?: QueryParameters,
        options?: IApiRequestOptions
    ): Promise<T | undefined> {
        return this.makeRequest<T>(path, queryParameters, undefined, options)
    }

    protected post<T>(
        path: string,
        queryParameters?: QueryParameters,
        body?: string,
        options?: IApiRequestOptions
    ): Promise<T | undefined> {
        return this.makeRequest<T>(path, queryParameters, body, options)
    }

    private async makeRequest<T>(
        path: string,
        queryParameters?: QueryParameters,
        body?: string,
        options?: IApiRequestOptions
    ): Promise<T | undefined> {
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
            if (queryParameters && Object.keys(queryParameters).length) {
                const queryParametersString = buildQueryParametersFromObject(queryParameters)
                path = `${path}?${queryParametersString}`
            }
            const response = await fetch(`${this._baseUrl}/${path}`, requestInit)
            return (await response.json()) as T
        } catch (err) {
            // Do nothing.
        }
    }
}
