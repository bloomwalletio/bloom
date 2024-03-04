import fs from 'fs'
import { app } from 'electron'

import type { IVersionDetails } from '../interfaces/version-details.interface'

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24
const DAYS_TO_KEEP_LOGS = 30

export function initializeLogger(versionDetails: IVersionDetails): void {
    try {
        if (process.env.STAGE !== 'prod') {
            const baseDir = app.getPath('userData')
            const logDir = prepareLogDirectory(baseDir)
            deleteOldLogs(logDir, versionDetails.currentVersion)
        }
    } catch (err) {
        console.error('[Preload Context] Error:', err)
    }
}

function prepareLogDirectory(baseDir: string): string {
    const logDir = `${baseDir}/logs`
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir)
    }
    return logDir
}

function deleteOldLogs(path: string, currentVersion: string): void {
    const files = fs.readdirSync(path)
    files.forEach((file) => {
        const filePath = path + '/' + file
        const stat = fs.statSync(filePath)

        const isOlderThan30Days =
            new Date().getTime() - new Date(stat.mtime).getTime() > DAYS_TO_KEEP_LOGS * DAY_IN_MILLISECONDS
        const version = file.match(/wallet-v((\w*.)*)-d((\w*.)*).log/)?.[1]
        const isDifferentVersion = version !== currentVersion
        if (isDifferentVersion || isOlderThan30Days) {
            fs.unlinkSync(filePath)
        }
    })
}
