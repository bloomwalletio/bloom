import type { OutputData } from '@iota/sdk/out/types'

export function sumTotalFromOutputs(outputs: OutputData[]): bigint {
    return outputs?.reduce(
        (total: bigint, outputData: OutputData) => (total += BigInt(outputData?.output?.amount)),
        BigInt(0)
    )
}
