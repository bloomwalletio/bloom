import keytar from 'keytar'
import { app } from 'electron'

interface Credential {
    account: string
    password: string
}

export default class KeychainManager {
    private serviceName: string

    constructor() {
        this.serviceName = app?.isPackaged ? app.getName() : 'Bloom — Dev'
    }

    public getAll(): Promise<Credential[]> {
        return keytar.findCredentials(this.serviceName)
    }

    public get(key: string): Promise<string | null> {
        return keytar.getPassword(this.serviceName, key)
    }

    public set(key: string, content: string): Promise<void> {
        return keytar.setPassword(this.serviceName, key, content)
    }

    public remove(key: string): Promise<boolean> {
        return keytar.deletePassword(this.serviceName, key)
    }
}
