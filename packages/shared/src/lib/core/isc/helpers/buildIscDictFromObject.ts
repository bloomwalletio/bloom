import { Converter } from '@iota/util.js'
import { IscDict, IscDictItem } from '../types'

export function buildIscDictFromObject(obj: Record<string, Uint8Array>): IscDict {
    const items: IscDictItem[] = []
    for (const key in obj) {
        items.push({
            key: Converter.utf8ToBytes(key),
            value: obj[key],
        })
    }
    return { items }
}
