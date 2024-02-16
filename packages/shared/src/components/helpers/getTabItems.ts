import { localize } from '@core/i18n'
import { KeyValue } from '../types'
import { PopupTab } from '@ui/enums'

export function getTabItems(items: PopupTab[]): KeyValue<string>[] {
    return items.map((item) => ({ key: item, value: localize(`general.${item}`) }))
}
