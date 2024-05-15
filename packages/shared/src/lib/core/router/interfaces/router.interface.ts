export interface IRouter {
    next(params?: Record<string, unknown>): void
    previous(): void

    reset?(): void

    hasHistory(): boolean
}
