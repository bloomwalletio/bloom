export interface IMintTokenDetails {
    name: string
    totalSupply: bigint
    circulatingSupply: bigint
    decimals: number
    symbol: string
    description?: string
    url?: string
    logoUrl?: string
    aliasId: string
}
