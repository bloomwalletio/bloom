/**
 * The download progress metadata, used
 * when download an application update.
 */
export type IAppUpdateState = {
    progress: number
    minutesRemaining: number
    busy: boolean
    complete: boolean
    error: boolean
}
