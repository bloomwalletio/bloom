import { AssetOrderOption, OrderOption } from '@core/utils/enums/filters'
import { get } from 'svelte/store'
import { ITokenWithBalance } from '../interfaces'
import { tokenFilter } from '../stores'

export function sortTokens(tokens: ITokenWithBalance[]): ITokenWithBalance[] {
    const filter = get(tokenFilter)
    let orderFunction = sortByName
    let isAscending = true

    if (filter.order.active) {
        switch (filter.order.selected) {
            case AssetOrderOption.Name:
                orderFunction = sortByName
                break
            case AssetOrderOption.Amount:
                orderFunction = sortByAmount
                break
        }
        isAscending = filter.order.ascDesc === OrderOption.Asc
    }

    return tokens?.sort((token1, token2) => orderFunction(token1, token2, isAscending)) ?? []
}

function sortByName(token1: ITokenWithBalance, token2: ITokenWithBalance, asc: boolean): number {
    const name1 = token1?.metadata?.name
    const name2 = token2?.metadata?.name
    if (!name1) {
        return asc ? 1 : -1
    } else if (!name2) {
        return asc ? -1 : 1
    }

    return name1.toLowerCase() > name2.toLowerCase() ? (asc ? 1 : -1) : asc ? -1 : 1
}

function sortByAmount(token1: ITokenWithBalance, token2: ITokenWithBalance, asc: boolean): number {
    return token1.balance.total > token2.balance.total ? (asc ? 1 : -1) : asc ? -1 : 1
}
