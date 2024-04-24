export interface IAppParameters {
    denylists: {
        urls: string[]
        keywords: string[]
    }
    allowlists: {
        urls: string[]
    }
}
