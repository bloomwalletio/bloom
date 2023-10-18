import { SendFlowType } from '@core/wallet/enums'

/**
 * We need a fallback estimated gas, since we cannot estimate calls to the magic contract if there is no balance on the sender address.
 * For L1 -> L2 transfers we observed the following gas costs:
 *      Base Token Transfer: < 24200 glow
 *      Native Token Transfer: < 24350 glow
 *      NFT Transfer: < 24700 glow */
export const FALLBACK_ESTIMATED_GAS: { [key in SendFlowType]: number } = {
    [SendFlowType.BaseCoinTransfer]: 24_200,
    [SendFlowType.TokenTransfer]: 24_350,
    [SendFlowType.NftTransfer]: 24_700,
    [SendFlowType.TokenUnwrap]: 54_800,
    [SendFlowType.NftUnwrap]: 70_000,
}
