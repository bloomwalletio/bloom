import { IError } from '@core/error/interfaces'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export class JsonFileManager {
    public static saveJsonToFile(filename: string, data: object): void {
        try {
            fs.writeFileSync(JsonFileManager.getFilePath(filename), JSON.stringify(data))
        } catch (err) {
            console.error(err)
        }
    }

    public static loadJsonFromFile(filename: string): object | undefined {
        try {
            return JSON.parse(fs.readFileSync(JsonFileManager.getFilePath(filename)).toString())
        } catch (err) {
            if (!(err as IError).message?.includes('ENOENT')) {
                console.error(err)
            }
        }
    }

    private static getFilePath(filename: string): string {
        const userDataPath = app.getPath('userData')
        return path.join(userDataPath, filename)
    }
}
