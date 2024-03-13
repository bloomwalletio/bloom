import { localize } from '@core/i18n'
import { QueryParameters } from './types'
import { buildUrl } from './url'

interface IApiRequestOptions {
    disableCors?: boolean
}

export class BaseApi {
    private readonly _baseUrl: string
    private readonly _basePath: string

    constructor(baseUrl: string, basePath?: string) {
        this._baseUrl = baseUrl
        this._basePath = basePath ?? ''
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

            const url = buildUrl({
                origin: this._baseUrl,
                pathname: `${this._basePath ? this._basePath + '/' : ''}${path}`,
                query: queryParameters,
            })
            if (!url) {
                throw localize('error.global.invalidUrl')
            }

            const response = await fetch(url.href, requestInit)
            return (await response.json()) as T
        } catch (err) {
            console.error(err)
        }
    }
}
