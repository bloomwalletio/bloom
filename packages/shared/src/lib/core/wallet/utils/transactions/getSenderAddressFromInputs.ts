import { UnlockConditionType } from '@iota/sdk/out/types'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ADDRESS_TYPE_ALIAS } from '@core/wallet/constants'
import { IAddressUnlockCondition, IAliasOutput, IExpirationUnlockCondition } from '@iota/types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getSenderAddressFromInputs(inputs: IWrappedOutput[]): string {
    for (const input of inputs) {
        const { output, metadata } = input
        const { unlockConditions } = output

        const spentDate = metadata.milestoneTimestampSpent

        // A transaction with an expiration unlock condition is included if the transaction expired
        const expirationUnlockCondition = unlockConditions.find(
            (unlockCondition) =>
                unlockCondition.type === UnlockConditionType.Expiration && unlockCondition.unixTime < spentDate
        ) as IExpirationUnlockCondition
        if (expirationUnlockCondition) {
            return getBech32AddressFromAddressTypes(expirationUnlockCondition.returnAddress)
        }

        const addressUnlockCondition = unlockConditions.find(
            ({ type }) => type === UnlockConditionType.Address
        ) as IAddressUnlockCondition
        if (addressUnlockCondition) {
            return getBech32AddressFromAddressTypes(addressUnlockCondition.address)
        }

        // TODO: if additional metadata is added to an aliasOutput, we could use it to determine the EVM Sender.
        const aliasId = (output as IAliasOutput)?.aliasId
        if (aliasId) {
            return getBech32AddressFromAddressTypes({ type: ADDRESS_TYPE_ALIAS, aliasId })
        }
    }
    return undefined
}
