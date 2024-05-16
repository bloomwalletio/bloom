import { Abi } from '@core/layer-2'
import Web3 from 'web3'
import type { AbiItem, AbiInput } from 'web3-utils'

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

    public decodeData(data: string):
        | {
              name: string
              inputs: Record<
                  string,
                  {
                      name: string
                      type: string
                      value: unknown
                  }
              >
          }
        | undefined {
        const functionSignature = data.slice(2, 10)
        const abiItem = this.abi[functionSignature]

        if (!abiItem || !abiItem.name) {
            return undefined
        }

        const decoded = this.web3.eth.abi.decodeParameters(abiItem.inputs ?? [], data.slice(10))

        const inputs: {
            [key: string]: {
                name: string
                type: string
                value: unknown
            }
        } = {}
        for (let i = 0; i < decoded.__length__; i++) {
            const dataInput = decoded[i]
            const abiInput = abiItem.inputs?.[i]

            if (!dataInput || !abiInput) {
                continue
            }

            const parsedInput = this.parseInputParameter(abiInput, dataInput)
            inputs[abiInput.name] = {
                name: abiInput.name,
                type: abiInput.type,
                value: parsedInput,
            }
        }

        return {
            name: abiItem.name,
            inputs,
        }
    }

    private parseInputParameter(input: AbiInput, value: unknown): unknown {
        if (input.type === 'tuple') {
            const parsedValueMap: { [key: string]: unknown } = {}
            input.components?.forEach((_input, index) => {
                parsedValueMap[_input.name] = this.parseInputParameter(_input, (value as unknown[])[index])
            })
            return parsedValueMap
        } else if (input.type === 'tuple[]') {
            const tmpInput = { ...input, type: 'tuple', name: `${input.name}_item` }
            const parsedValueList = (value as unknown[])?.map((_value) => this.parseInputParameter(tmpInput, _value))
            return parsedValueList
        } else if (input.type.startsWith('uint') || input.type.startsWith('int')) {
            const isArray = Array.isArray(value)

            if (isArray) {
                return value.map((val) => this.web3.utils.toBN(val).toString())
            } else {
                return this.web3.utils.toBN(value as string).toString()
            }
        } else if (input.type.startsWith('address')) {
            const isArray = Array.isArray(value)

            if (isArray) {
                return value.map((addr) => addr.toLowerCase())
            } else {
                return (value as string).toLowerCase()
            }
        } else {
            return value
        }
    }
}

function concatInputsToString(input: AbiInput): string {
    if (input.type === 'tuple') {
        return '(' + input.components?.map(concatInputsToString).join(',') + ')'
    } else if (input.type === 'tuple[]') {
        return '(' + input.components?.map(concatInputsToString).join(',') + ')[]'
    } else {
        return input.type
    }
}
