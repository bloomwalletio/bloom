import { IToken, TokenFilter } from '@core/token/interfaces'
import { tokenFilter, tokenSearchTerm } from '@core/token/stores'
import { BooleanFilterOption } from '@core/utils/enums/filters'
import { get } from 'svelte/store'
import { getUnitFromTokenMetadata } from '../utils'

// Filters assets based on token properties. If none of the conditionals are valid, then token is shown.
export function isVisibleToken(token: IToken): boolean {
    const filter = get(tokenFilter)
    const searchTerm = get(tokenSearchTerm)
    if (!isVisibleWithActiveHiddenFilter(token, filter)) {
        return false
    }
    if (!isVisibleWithActiveVerificationStatusFilter(token, filter)) {
        return false
    }
    if (!isVisibleWithNetworkFilter(token, filter)) {
        return false
    }
    if (!isVisibleWithSearchTerm(token, searchTerm)) {
        return false
    }
    return true
}

function isVisibleWithActiveHiddenFilter(token: IToken, filter: TokenFilter): boolean {
    if ((!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) && token.hidden) {
        return false
    }
    return true
}

function isVisibleWithActiveVerificationStatusFilter(token: IToken, filter: TokenFilter): boolean {
    if (
        filter.verificationStatus.active &&
        filter.verificationStatus.selected &&
        token.verification?.status !== filter.verificationStatus.selected
    ) {
        return false
    }
    return true
}

function isVisibleWithNetworkFilter(token: IToken, filter: TokenFilter): boolean {
    if (filter.network.active && filter.network.selected && token.networkId !== filter.network.selected) {
        return false
    }
    return true
}

function isVisibleWithSearchTerm(token: IToken, searchTerm: string): boolean {
    if (searchTerm) {
        if (!token.metadata) {
            return false
        }

        const name = token.metadata.name?.toLowerCase()
        const symbol = getUnitFromTokenMetadata(token.metadata).toLowerCase()
        if (!name.includes(searchTerm.toLowerCase()) && !symbol.includes(searchTerm.toLowerCase())) {
            return false
        }
    }
    return true
}
