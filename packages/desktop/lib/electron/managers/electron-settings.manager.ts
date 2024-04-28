import { JsonFileManager } from './json-file.manager'
import { IElectronSettings } from '../interfaces'

const SETTINGS_FILE_NAME = 'settings.json'

export class ElectronSettingsManager {
    public static saveSettings(settings: IElectronSettings): void {
        JsonFileManager.saveJsonToFile(SETTINGS_FILE_NAME, settings)
    }

    public static loadSettings(): IElectronSettings {
        const settings = JsonFileManager.loadJsonFromFile(SETTINGS_FILE_NAME) as IElectronSettings | undefined
        return settings ? settings : { windowState: { width: 800, height: 600 } }
    }

    public static updateSettings(settings: IElectronSettings): void {
        const config = ElectronSettingsManager.loadSettings()
        ElectronSettingsManager.saveSettings({ ...config, ...settings })
    }
}
