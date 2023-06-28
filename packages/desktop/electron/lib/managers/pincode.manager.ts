import { ipcRenderer } from 'electron'

export default class PincodeManager {
    /**
     * Sets pincode in keychain
     *
     * @method set
     *
     * @param {string} key
     * @param {string} pincode
     *
     * @returns {Promise}
     */
    public async set(key: string, pincode: string): Promise<unknown> {
        return ipcRenderer.invoke('keychain-set', key, pincode)
    }
    /**
     * Verifies user entered pincode against the one stored in keychain
     *
     * @method verify
     *
     * @param {string} key
     * @param {string} pincode
     *
     * @returns {Promise}
     */
    public async verify(key: string, pincode: string): Promise<boolean> {
        const storedPincode = await ipcRenderer.invoke('keychain-get', key)
        return storedPincode === pincode
    }

    /**
     * Removes pincode entry from the keychain
     *
     * @method remove
     *
     * @param {string} key
     *
     * @returns {Promise}
     */
    public async remove(key: string): Promise<unknown> {
        return ipcRenderer.invoke('keychain-remove', key)
    }
}
