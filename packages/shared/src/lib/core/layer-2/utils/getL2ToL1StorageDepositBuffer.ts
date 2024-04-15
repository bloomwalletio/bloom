import { DEFAULT_PROTOCOL } from '@core/network/constants'
import { NetworkId } from '@core/network/types'
import { SendFlowType } from '@core/wallet/enums'

const L2_TO_L1_STORAGE_DEPOSIT_BUFFER_BYTE_COST: { [key in UnwrapSendFlow]: bigint } = {
    [SendFlowType.TokenUnwrap]: BigInt(565),
    [SendFlowType.NftUnwrap]: BigInt(35),
}

type UnwrapSendFlow = SendFlowType.TokenUnwrap | SendFlowType.NftUnwrap

export function getL2ToL1StorageDepositBuffer(type: UnwrapSendFlow, network: NetworkId): bigint {
    const vByteCost = DEFAULT_PROTOCOL[network]?.rentStructure.vByteCost
    if (!vByteCost) {
        throw new Error(`Virtual byte cost for ${network} is undefined!`)
    }

    return BigInt(vByteCost) * L2_TO_L1_STORAGE_DEPOSIT_BUFFER_BYTE_COST[type]
}
