import BigInteger from 'big-integer'

/**
 * We need a fallback gas budget, since we cannot estimate calls to the magic contract.
 * For L1 -> L2 transfers we observed the following gas costs:
 *      Base Token Transfer: 22 000 glow
 *      Native Token Transfer: 63 000 glow
 *      NFT Transfer: 75 600 glow
 * Therefor we set the fallback gas budget to 100 000 glow
 */
export const FALLBACK_GAS_BUDGET = BigInteger(100000)
