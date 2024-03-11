import { ClassicLevel } from 'classic-level'
import fs from 'fs'
import path from 'path'
import { app, ipcMain } from 'electron'

interface IThirdPartyAppManager {
    getDataFromApp(appName: string): Promise<Record<string, unknown> | undefined>
}

export default class ThirdPartyAppManager implements IThirdPartyAppManager {
    private userDataPath: string

    constructor() {
        this.init()
    }

    init(): void {
        this.userDataPath = app.getPath('userData')

        this.removeHandlers()
        ipcMain.handle('get-data-from-third-party-app', (_e, name) => this.getDataFromApp(name))
    }

    public async getDataFromApp(appName: string): Promise<Record<string, unknown> | undefined> {
        const levelDBPath = path.resolve(`${this.userDataPath}/../${appName}/Local Storage/leveldb`)
        // check if the path exists
        if (!fs.existsSync(levelDBPath)) {
            return
        }

        const data: Record<string, { key: string; value: unknown }> = {}

        try {
            const db = new ClassicLevel(levelDBPath)
            let i = 0
            for await (const [key, value] of db.iterator()) {
                data[i] = { key: key.toString(), value: value.substring(1) }
                i++
            }
            db.close()
            return data
        } catch (err) {
            console.error(err)
        }
    }

    private removeHandlers(): void {
        ipcMain.removeHandler('get-data-from-third-party-app')
    }
}
