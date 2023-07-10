export interface IPincodeManager {
    set(id: string, pin: string): Promise<void>
    remove(id: string): Promise<void>
    verify(id: string, pin: string): Promise<boolean>
}
