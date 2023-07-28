import { AddressType } from '@iota/sdk/out/types/block/address'
import { FoundryOutput } from '@iota/sdk/out/types/block/output'
import { HexHelper, WriteStream } from '@iota/util.js'

export function buildFoundryId(foundry: FoundryOutput): string {
    const immutableAliasUnlockCondition = foundry.unlockConditions[0]
    const aliasId =
        immutableAliasUnlockCondition.type === 6 && immutableAliasUnlockCondition.address.type === ADDRESS_TYPE_ALIAS
            ? immutableAliasUnlockCondition.address.aliasId
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
