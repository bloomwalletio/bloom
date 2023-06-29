import { ipcRenderer } from 'electron'

export default class PincodeManager {
    public async set(key: string, pincode: string): Promise<unknown> {
        return ipcRenderer.invoke('keychain-set', key, pincode)
    }

    public async verify(key: string, pincode: string): Promise<boolean> {
        const storedPincode = await ipcRenderer.invoke('keychain-get', key)
        return storedPincode === pincode
    }

    public async remove(key: string): Promise<unknown> {
        return ipcRenderer.invoke('keychain-remove', key)
    }
}
