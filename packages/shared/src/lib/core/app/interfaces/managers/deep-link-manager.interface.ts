/**
 * The interface for managing deep links.
 */
export interface IDeepLinkManager {
    checkForDeepLinkRequest(): void
    clearDeepLinkRequest(): void
}
