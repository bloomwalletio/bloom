import { SendFlowType } from '@core/wallet/enums'

/**
 * We need a fallback estimated gas, since we cannot estimate calls to the magic contract if there is no balance on the sender address.
 * For L1 -> L2 transfers we observed the following gas costs:
 *      Base Token Transfer: < 24200 glow
 *      Native Token Transfer: < 24350 glow
 *      NFT Transfer: < 24700 glow */
export const FALLBACK_ESTIMATED_GAS: { [key in SendFlowType]: bigint } = {
    [SendFlowType.BaseCoinTransfer]: BigInt(10_000),
    [SendFlowType.TokenTransfer]: BigInt(10_000),
    [SendFlowType.NftTransfer]: BigInt(50_000),
    [SendFlowType.TokenUnwrap]: BigInt(53_892),
    [SendFlowType.NftUnwrap]: BigInt(72_307),
}
