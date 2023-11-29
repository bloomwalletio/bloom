export type CallbackParameters = {
    result?: unknown
    error?: {
        code: number
        message: string
    }
}
