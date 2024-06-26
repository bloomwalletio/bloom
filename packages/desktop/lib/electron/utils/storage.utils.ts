import { KeyValue } from '@ui/types'
import { ClassicLevel } from 'classic-level'
import path from 'path'
import fs from 'fs'

export async function getDataFromApp(
    appName: string,
    userDataPath: string
): Promise<Record<number, KeyValue<string>> | undefined> {
    const levelDBPath = path.resolve(userDataPath, '..', appName, 'Local Storage/leveldb')
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
        // https://github.com/Level/abstract-level#errors
        const _err = err as Error & { code?: string }
        if (_err?.code) {
            throw new Error(_err.code)
        } else {
            console.error(err)
        }
    }
}
