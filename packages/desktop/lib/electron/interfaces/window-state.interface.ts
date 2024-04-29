import { BrowserWindow } from 'electron'

export interface IWindowState {
    x?: number
    y?: number
    width: number
    height: number
    isMaximized?: boolean

    track?(window: BrowserWindow): void
}
