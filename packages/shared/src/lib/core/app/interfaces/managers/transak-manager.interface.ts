import { ITransakWindowData } from '../transak-window-data.interface'

export interface ITransakManager {
    openWindow(data: ITransakWindowData): void
    closeWindow(): void
    minimizeWindow(): void
    restoreWindow(): void
    positionWindow(): void
    updateTransakBounds(rect: { x: number; y: number; width: number; height: number }): void
}
