import { StardustNetworkId, getStardustNetwork } from '@core/network'
import { DEFAULT_PROTOCOL } from '@core/network/constants'
import { SendFlowType } from '@core/wallet/enums'

const L2_TO_L1_STORAGE_DEPOSIT_BUFFER_BYTES: { [key in UnwrapSendFlow]: bigint } = {
    [SendFlowType.TokenUnwrap]: BigInt(565),
    [SendFlowType.NftUnwrap]: BigInt(35),
}

type UnwrapSendFlow = SendFlowType.TokenUnwrap | SendFlowType.NftUnwrap

export function getL2ToL1StorageDepositBuffer(type: UnwrapSendFlow, networkId: StardustNetworkId): bigint {
    const network = getStardustNetwork()
    if (!network) {
        return BigInt(0)
    }

    const actualVByteCost = network.protocol.rentStructure.vByteCost
    let expectedVByteCost = DEFAULT_PROTOCOL[networkId]?.rentStructure.vByteCost

    // TODO: Validate byte cost returned by node
    if (!expectedVByteCost && !actualVByteCost) {
        throw new Error(`Virtual byte cost for ${networkId} is undefined!`)
        // } else if (!actualVByteCost) {
        //     throw new Error('Node does not return virtual byte cost')
    } else if (!expectedVByteCost) {
        expectedVByteCost = actualVByteCost
    }

    // if (expectedVByteCost !== actualVByteCost) {
    //     throw new Error('Virtual byte cost from the node differs from the expected values')
    // }

    return BigInt(expectedVByteCost) * L2_TO_L1_STORAGE_DEPOSIT_BUFFER_BYTES[type]
}
