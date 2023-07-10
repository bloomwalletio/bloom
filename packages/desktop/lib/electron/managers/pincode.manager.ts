import { ipcRenderer } from 'electron'
import type { IPincodeManager } from '@core/app'

export default class PincodeManager implements IPincodeManager {
    public async set(key: string, pincode: string): Promise<void> {
        return ipcRenderer.invoke('keychain-set', key, pincode)
    }

    public async verify(key: string, pincode: string): Promise<boolean> {
        const storedPincode = await ipcRenderer.invoke('keychain-get', key)
        return storedPincode === pincode
    }

    public async remove(key: string): Promise<void> {
        return ipcRenderer.invoke('keychain-remove', key)
    }
}
