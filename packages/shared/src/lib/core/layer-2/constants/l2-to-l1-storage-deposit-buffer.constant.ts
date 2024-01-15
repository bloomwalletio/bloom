import { SendFlowType } from '@core/wallet/enums'

export const L2_TO_L1_STORAGE_DEPOSIT_BUFFER: { [key in SendFlowType]?: bigint } = {
    [SendFlowType.TokenUnwrap]: BigInt(56_500),
    [SendFlowType.NftUnwrap]: BigInt(3_500),
}
