import { localize } from '@core/i18n'
import { KeyValue } from '../types'
import { Tab } from '@ui/enums'

export function getTabItems(items: Tab[]): KeyValue<string>[] {
    return items.map((item) => ({ key: item, value: localize(`general.${item}`) }))
}
