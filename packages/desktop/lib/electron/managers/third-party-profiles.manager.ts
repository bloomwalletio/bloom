import fs from 'fs'
import path from 'path'
import { app, ipcMain } from 'electron'
import { ThirdPartyAppName } from '@auxiliary/third-party/enums/third-party-app-name.enum'
import { getDataFromApp } from '../utils/storage.utils'

interface IThirdPartyAppManager {
    copyProfileDirectory(appName: string, profileId: string): void
}

export default class ThirdPartyAppManager implements IThirdPartyAppManager {
    private userDataPath: string = ''

    constructor() {
        this.init()
    }

    init(): void {
        this.userDataPath = app.getPath('userData')

        this.removeHandlers()
        ipcMain.handle('get-third-party-apps', () => this.getThirdPartyApps())
        ipcMain.handle(
            'get-data-from-third-party-app',
            async (_e, name) => await getDataFromApp(name, this.userDataPath)
        )
        ipcMain.handle('copy-third-party-profile', (_e, name, profileId) => this.copyProfileDirectory(name, profileId))
    }

    public getThirdPartyApps(): ThirdPartyAppName[] {
        const apps = Object.values(ThirdPartyAppName).filter((appName) => {
            const appPath = path.resolve(this.userDataPath, '..', appName)
            return fs.existsSync(appPath)
        })
        return apps
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
        ipcMain.removeHandler('get-third-party-apps')
        ipcMain.removeHandler('get-data-from-third-party-app')
        ipcMain.removeHandler('copy-third-party-profile')
    }
}
