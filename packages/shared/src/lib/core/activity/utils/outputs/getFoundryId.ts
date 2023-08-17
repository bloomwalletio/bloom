import {
    AddressType,
    AliasAddress,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { HexHelper, WriteStream } from '@iota/util.js'

export function buildFoundryId(foundry: FoundryOutput): string {
    const immutableAliasUnlockCondition = foundry.unlockConditions[0] as ImmutableAliasAddressUnlockCondition
    const aliasId =
        immutableAliasUnlockCondition.type === UnlockConditionType.ImmutableAliasAddress &&
        immutableAliasUnlockCondition.address.type === AddressType.Alias
            ? (immutableAliasUnlockCondition.address as AliasAddress).aliasId
            : ''
    const typeWS = new WriteStream()
    typeWS.writeUInt8('alias address type', AddressType.Alias)
    const aliasAddress = HexHelper.addPrefix(`${typeWS.finalHex()}${HexHelper.stripPrefix(aliasId)}`)
    const serialNumberWS = new WriteStream()
    serialNumberWS.writeUInt32('serialNumber', foundry.serialNumber)
    const serialNumberHex = serialNumberWS.finalHex()
    const tokenSchemeTypeWS = new WriteStream()
    tokenSchemeTypeWS.writeUInt8('tokenSchemeType', foundry.tokenScheme.type)
    const tokenSchemeTypeHex = tokenSchemeTypeWS.finalHex()

    return `${aliasAddress}${serialNumberHex}${tokenSchemeTypeHex}`
}
