import { ClassicLevel } from 'classic-level'
import fs from 'fs'
import path from 'path'
import { app, ipcMain } from 'electron'
import { KeyValue } from '@ui/types'

interface IThirdPartyAppManager {
    getDataFromApp(appName: string): Promise<Record<string, unknown> | undefined>
    copyProfileDirectory(appName: string, profileId: string): void
}

export default class ThirdPartyAppManager implements IThirdPartyAppManager {
    private userDataPath: string

    constructor() {
        this.init()
    }

    init(): void {
        this.userDataPath = app.getPath('userData')

        this.removeHandlers()
        ipcMain.handle('get-data-from-third-party-app', async (_e, name) => await this.getDataFromApp(name))
        ipcMain.handle('copy-third-party-profile', (_e, name, profileId) => this.copyProfileDirectory(name, profileId))
    }

    public async getDataFromApp(appName: string): Promise<Record<number, KeyValue<string>> | undefined> {
        const levelDBPath = path.resolve(this.userDataPath, '..', appName, 'Local Storage/leveldb')
        // check if the path exists
        if (!fs.existsSync(levelDBPath)) {
            return
        }

        const data: Record<string, KeyValue<string>> = {}

        try {
            const db = new ClassicLevel(levelDBPath)
            let i = 0
            for await (const [key, value] of db.iterator()) {
                data[i] = { key: key.toString(), value: value.substring(1) }
                i++
            }
            await db.close()
            return data
        } catch (err) {
            console.error(err)
        }
    }

    public copyProfileDirectory(appName: string, profileId: string): void {
        const pathToCopy = path.resolve(this.userDataPath, '..', appName, '__storage__', profileId)
        const destinationPath = path.resolve(this.userDataPath, '__storage__', profileId)
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true })
        }
        fs.cp(pathToCopy, destinationPath, { recursive: true }, (err) => {
            if (err) console.error(err)
        })
    }

    private removeHandlers(): void {
        ipcMain.removeHandler('get-data-from-third-party-app')
        ipcMain.removeHandler('copy-third-party-profile')
    }
}
