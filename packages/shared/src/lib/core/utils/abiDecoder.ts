import { Abi } from '@core/layer-2'
import Web3 from 'web3'
import type { AbiItem, AbiInput } from 'web3-utils'

interface ParsedInput {
    name: string
    value: unknown
    type: string
}
/* eslint-disable no-console */

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

    public decodeData(data: string): unknown {
        const functionSignature = data.slice(2, 10)
        const abiItem = this.abi[functionSignature]

        if (!abiItem) {
            return undefined
        }

        const decoded = this.web3.eth.abi.decodeParameters(abiItem.inputs ?? [], data.slice(10))
        console.log(abiItem, decoded)

        const inputs: { [key: string]: ParsedInput } = {}
        for (let i = 0; i < decoded.__length__; i++) {
            const dataInput = decoded[i]
            const abiInput = abiItem.inputs?.[i]

            if (!dataInput || !abiInput) {
                continue
            }

            const parsedInput = abc(abiInput, dataInput)
            inputs[parsedInput.name] = parsedInput
        }
        //     const isUint = abiItem.inputs[i].type.indexOf('uint') === 0;
        //     const isInt = abiItem.inputs[i].type.indexOf('int') === 0;
        //     const isAddress = abiItem.inputs[i].type.indexOf('address') === 0;

        //     if (isUint || isInt) {
        //         const isArray = Array.isArray(param);

        //         if (isArray) {
        //         parsedParam = param.map(val => new BN(val).toString());
        //         } else {
        //         parsedParam = new BN(param).toString();
        //         }
        //     }

        //     // Addresses returned by web3 are randomly cased so we need to standardize and lowercase all
        //     if (isAddress) {
        //         const isArray = Array.isArray(param);

        //         if (isArray) {
        //         parsedParam = param.map(_ => _.toLowerCase());
        //         } else {
        //         parsedParam = param.toLowerCase();
        //         }
        //     }

        //     retData.params.push({
        //         name: abiItem.inputs[i].name,
        //         value: parsedParam,
        //         type: abiItem.inputs[i].type,
        //     });
        // }

        console.log(inputs)

        return decoded
    }
}

function abc(input: AbiInput, value: unknown): ParsedInput {
    if (input.type === 'tuple') {
        const _parsedValue = input.components?.map((_input, index) => abc(_input, (value as unknown[])[index]))
        const parsedValue: { [key: string]: ParsedInput } = {}
        _parsedValue?.forEach((_input) => {
            parsedValue[_input.name] = _input
        })
        return {
            name: input.name,
            value: parsedValue,
            type: input.type,
        }
    } else if (input.type === 'tuple[]') {
        console.log('adadasd', input, value)
        const tmpInput = { ...input, type: 'tuple' }
        const parsedValue = (value as unknown[])?.map((_value) => abc(tmpInput, _value))
        // const parsedValue = input.components?.map((_input, index) => abc(_input, (value as any[])[index]))

        return {
            name: input.name,
            value: parsedValue,
            type: input.type,
        }
    }
    return {
        name: input.name,
        value,
        type: input.type,
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
