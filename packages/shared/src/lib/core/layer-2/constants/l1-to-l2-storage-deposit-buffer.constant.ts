import { SendFlowType } from '@core/wallet/enums'

export const L2_TO_L1_STORAGE_DEPOSIT_BUFFER: { [key in SendFlowType]?: number } = {
    [SendFlowType.TokenUnwrap]: 56_400,
    [SendFlowType.NftUnwrap]: 3_500,
}
