export interface IPincodeManager {
    set(id: string, pin: string): Promise<void>
    get(id: string, appName?: string): Promise<string | null>
    remove(id: string): Promise<void>
    verify(id: string, pin: string): Promise<boolean>
}
