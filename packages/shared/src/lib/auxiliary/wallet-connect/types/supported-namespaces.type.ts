export type SupportedNamespaces = Record<string, ISupportedNamespace>

export interface ISupportedNamespace {
    chains: string[]
    methods: string[]
    events: string[]
    accounts: string[]
}
