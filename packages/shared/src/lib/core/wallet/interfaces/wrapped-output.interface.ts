import { OutputData } from '@iota/sdk'
import { Output } from '../types'

export interface IWrappedOutput extends Omit<Partial<OutputData>, 'output'> {
    outputId: string
    output: Output
}
