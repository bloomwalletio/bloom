import { IToken, TokenFilter } from '@core/token/interfaces'
import { tokenFilter } from '@core/token/stores'
import { BooleanFilterOption } from '@core/utils/enums/filters'
import { get } from 'svelte/store'

// Filters assets based on token properties. If none of the conditionals are valid, then token is shown.
export function isVisibleToken(token: IToken): boolean {
    const filter = get(tokenFilter)
    if (!isVisibleWithActiveHiddenFilter(token, filter)) {
        return false
    }
    if (!isVisibleWithActiveVerificationStatusFilter(token, filter)) {
        return false
    }
    if (!isVisibleWithNetworkFilter(token, filter)) {
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
    const assetChainId = token.chainId
    if (filter.network.active && filter.network.selected >= 0 && assetChainId !== filter.network.selected) {
        return false
    }
    return true
}
