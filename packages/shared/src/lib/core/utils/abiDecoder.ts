import { Abi } from '@core/layer-2'
import Web3 from 'web3'
import type { AbiItem, AbiInput } from 'web3-utils'

interface ParsedInput {
    name: string
    value: unknown
    type: string
}

export class AbiDecoder {
    public abi: Record<string, AbiItem>
    public web3: Web3

    constructor(_abi: Abi, _web3: Web3) {
        const tmpAbi: Record<string, AbiItem> = {}
        for (const abiItem of _abi) {
            const functionParameters = abiItem.inputs?.map(concatInputsToString).join(',') ?? ''
            const functionSignature = `${abiItem.name}(${functionParameters})`

            const signature = _web3.utils.sha3(functionSignature)
            if (signature) {
                if (abiItem.type === 'event') {
                    tmpAbi[signature.slice(2)] = abiItem
                } else {
                    tmpAbi[signature.slice(2, 10)] = abiItem
                }
            }
        }
        this.abi = tmpAbi
        this.web3 = _web3
    }

    public decodeData(data: string): { [key: string]: ParsedInput } | undefined {
        const functionSignature = data.slice(2, 10)
        const abiItem = this.abi[functionSignature]

        if (!abiItem) {
            return undefined
        }

        const decoded = this.web3.eth.abi.decodeParameters(abiItem.inputs ?? [], data.slice(10))

        const inputs: { [key: string]: ParsedInput } = {}
        for (let i = 0; i < decoded.__length__; i++) {
            const dataInput = decoded[i]
            const abiInput = abiItem.inputs?.[i]

            if (!dataInput || !abiInput) {
                continue
            }

            const parsedInput = this.parseInputParameter(abiInput, dataInput)
            inputs[parsedInput.name] = parsedInput
        }

        return inputs
    }

    private parseInputParameter(input: AbiInput, value: unknown): ParsedInput {
        let parsedValue: unknown = value
        if (input.type === 'tuple') {
            const _parsedValueList = input.components?.map((_input, index) =>
                this.parseInputParameter(_input, (value as unknown[])[index])
            )
            const parsedValueMap: { [key: string]: ParsedInput } = {}
            _parsedValueList?.forEach((_input) => {
                parsedValueMap[_input.name] = _input
            })
            parsedValue = parsedValueMap
        } else if (input.type === 'tuple[]') {
            const tmpInput = { ...input, type: 'tuple', name: `${input.name}_item` }
            const parsedValueList = (value as unknown[])?.map((_value) => this.parseInputParameter(tmpInput, _value))
            parsedValue = parsedValueList
        } else if (input.type.startsWith('uint') || input.type.startsWith('int')) {
            const isArray = Array.isArray(value)

            if (isArray) {
                parsedValue = value.map((val) => this.web3.utils.toBN(val).toString())
            } else {
                parsedValue = this.web3.utils.toBN(value as string).toString()
            }
        } else if (input.type.startsWith('address')) {
            const isArray = Array.isArray(value)

            if (isArray) {
                parsedValue = value.map((addr) => addr.toLowerCase())
            } else {
                parsedValue = (value as string).toLowerCase()
            }
        }

        return {
            name: input.name,
            value: parsedValue,
            type: input.type,
        }
    }
}
function concatInputsToString(input: AbiInput): string {
    if (input.type === 'tuple') {
        return '(' + input.components?.map(concatInputsToString).join(',') + ')'
    }
    if (input.type === 'tuple[]') {
        return '(' + input.components?.map(concatInputsToString).join(',') + ')[]'
    }
    return input.type
}
