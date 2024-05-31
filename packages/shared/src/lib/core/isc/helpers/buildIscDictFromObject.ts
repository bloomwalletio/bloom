import { Converter } from '@iota/util.js'
import { IscDict, IscDictItem } from '../types'

export function buildIscDictFromObject(obj: Record<string, string | number | bigint | Uint8Array>): IscDict {
    const items: IscDictItem[] = []
    for (const key in obj) {
        switch (typeof obj[key]) {
            case 'string':
                items.push({
                    key: Converter.utf8ToBytes(key),
                    value: Converter.utf8ToBytes(obj[key] as string),
                })
                break
            case 'number':
                items.push({
                    key: Converter.utf8ToBytes(key),
                    value: Converter.utf8ToBytes(obj[key].toString()),
                })
                break
            case 'bigint':
                items.push({
                    key: Converter.utf8ToBytes(key),
                    value: Converter.utf8ToBytes(obj[key].toString()),
                })
                break
            case 'object':
                items.push({
                    key: Converter.utf8ToBytes(key),
                    value: obj[key] as Uint8Array,
                })
                break
        }
    }
    return { items }
}
