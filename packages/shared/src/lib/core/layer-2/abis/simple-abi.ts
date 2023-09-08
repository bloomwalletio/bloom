import { AbiType, StateMutabilityType } from '../enums'
import { Abi } from '../types'

export const SIMPLE_ABI: Abi = [
    {
        inputs: [
            { internalType: 'ISCHname', name: 'contractHname', type: 'uint32' },
            { internalType: 'ISCHname', name: 'entryPoint', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: 'params',
                type: 'tuple',
            },
        ],
        name: 'callView',
        outputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
]
