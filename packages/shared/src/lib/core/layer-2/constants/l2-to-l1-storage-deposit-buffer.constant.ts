import { SendFlowType } from '@core/wallet/enums'

export const L2_TO_L1_STORAGE_DEPOSIT_BUFFER: { [key in SendFlowType]?: bigint } = {
    [SendFlowType.TokenUnwrap]: BigInt(141_250),
    [SendFlowType.NftUnwrap]: BigInt(3_500),
}
