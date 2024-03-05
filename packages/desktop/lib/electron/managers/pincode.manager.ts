import { ipcRenderer } from 'electron'
import { createHash } from 'crypto'
import type { IPincodeManager } from '@core/app'

export default class PincodeManager implements IPincodeManager {
    public async set(key: string, pincode: string): Promise<void> {
        const hash = this.hashValue(key, pincode)
        return ipcRenderer.invoke('keychain-set', key, hash)
    }

    public async verify(key: string, pincode: string): Promise<boolean> {
        const hashedPin = this.hashValue(key, pincode)
        const storedHash = await ipcRenderer.invoke('keychain-get', key)
        if (pincode === storedHash) {
            // Set pincode as a hash if it is stored in clear text (legacy implementation)
            void this.set(key, pincode)
            return true
        } else {
            return hashedPin === storedHash
        }
    }

    public async remove(key: string): Promise<void> {
        return ipcRenderer.invoke('keychain-remove', key)
    }

    private hashValue(salt: string, value: string): string {
        const hash = createHash('sha256')
        const hashedValue = hash.update(`${salt}:${value}`).digest('base64')
        return hashedValue
    }
}
