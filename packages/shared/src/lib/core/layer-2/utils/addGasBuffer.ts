const GAS_LIMIT_MULTIPLIER = BigInt(110)

export function addGasBuffer(estimatedGas: bigint): bigint {
    return (estimatedGas * GAS_LIMIT_MULTIPLIER) / BigInt(100)
}
