export interface IDappMetadata {
    name: string
    description: string
    url: string
    icons: string[]
    verifyUrl?: string
    redirect?: {
        native?: string
        universal?: string
    }
}
