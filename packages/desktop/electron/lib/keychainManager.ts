import keytar from 'keytar';
import { app } from 'electron';

interface Credential {
    account: string;
    password: string;
}

/**
 * Service for interacting with the system's native keychain
 */
export class KeychainManager {
    private serviceName: string;

    constructor() {
        this.serviceName = app.isPackaged ? app.getName() : 'Bloom — Dev';
    }

    /**
     * Gets all credentials from keychain
     *
     * @returns Promise of array with credentials
     */
    public getAll(): Promise<Credential[]> {
        return keytar.findCredentials(this.serviceName);
    }

    /**
     * Gets credential from keychain for provided key
     *
     * @param key Key string
     *
     * @returns Promise of password string or null if not found
     */
    public get(key: string): Promise<string | null> {
        return keytar.getPassword(this.serviceName, key);
    }

    /**
     * Sets credential in keychain for provided key
     *
     * @param key Key string
     * @param content Content string
     *
     * @returns Promise of a void return
     */
    public set(key: string, content: string): Promise<void> {
        return keytar.setPassword(this.serviceName, key, content);
    }

    /**
     * Removes credential from keychain for provided key
     *
     * @param key Key string
     *
     * @returns Promise of a boolean that shows whether the password was deleted
     */
    public remove(key: string): Promise<boolean> {
        return keytar.deletePassword(this.serviceName, key);
    }
}

export default new KeychainManager()
