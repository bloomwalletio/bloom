import BigInteger from 'big-integer'

/**
 * We need a fallback estimated gas, since we cannot estimate calls to the magic contract.
 * For L1 -> L2 transfers we observed the following gas costs:
 *      Base Token Transfer: 22 000 glow
 *      Native Token Transfer: 63 000 glow
 *      NFT Transfer: 75 600 glow
 * Therefor we set the fallback estimated gas to 100 000 glow
 */
export const FALLBACK_ESTIMATED_GAS = BigInteger(100000)
