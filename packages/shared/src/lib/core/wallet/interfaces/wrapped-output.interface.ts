import { CommonOutput, OutputData } from '@iota/sdk/out/types'

export interface IWrappedOutput extends Omit<Partial<OutputData>, 'output'> {
    outputId: string
    output: CommonOutput | undefined
}
