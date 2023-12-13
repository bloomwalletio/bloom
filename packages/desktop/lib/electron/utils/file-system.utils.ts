import path from 'path'
import fs from 'fs'

export function ensureDirectoryExistence(filePath: string): void | boolean {
    const dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
        return true
    }
    ensureDirectoryExistence(dirname)
    fs.mkdirSync(dirname)
}
