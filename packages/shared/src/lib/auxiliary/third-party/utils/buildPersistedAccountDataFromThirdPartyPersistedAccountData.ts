import { IPersistedAccountData } from '@core/account'
import { IThirdPartyPersistedAccountData } from '../interfaces'

export function buildPersistedAccountDataFromThirdPartyPersistedAccountData(thirdPartyAccountData: {
    [accountId: string]: IThirdPartyPersistedAccountData
}): { [accountId: string]: IPersistedAccountData } {
    const persistedAccountData: { [accountId: string]: IPersistedAccountData } = {}
    for (const accountId in thirdPartyAccountData) {
        const thirdPartyAccountDataItem = thirdPartyAccountData[accountId]
        const persistedAccountDataItem: IPersistedAccountData = {
            name: thirdPartyAccountDataItem.name,
            color: thirdPartyAccountDataItem.color,
            hidden: thirdPartyAccountDataItem.hidden,
            shouldRevote: thirdPartyAccountDataItem.shouldRevote,
            removedProposalIds: thirdPartyAccountDataItem.removedProposalIds,
            evmAddresses: {},
            depositAddress: '', // TODO: Add deposit address during login
            otherAddresses: thirdPartyAccountDataItem.knownAddresses?.map((address) => address.address) ?? [],
        }
        persistedAccountData[accountId] = persistedAccountDataItem
    }
    return persistedAccountData
}
