import { ITransakWindowData } from '../transak-window-data.interface'

export interface ITransakManager {
    openWindow(data: ITransakWindowData): void
    closeWindow(): void
    positionWindow(): void
    setSidebarExpanded(expanded: boolean): void
}
