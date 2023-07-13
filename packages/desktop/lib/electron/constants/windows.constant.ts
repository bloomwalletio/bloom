import { BrowserWindow } from 'electron'

/**
 * Define wallet windows
 */
export const windows: Window = {
    main: null,
    about: null,
    error: null,
}

type Window = {
    main: BrowserWindow | null
    about: BrowserWindow | null
    error: BrowserWindow | null
}
