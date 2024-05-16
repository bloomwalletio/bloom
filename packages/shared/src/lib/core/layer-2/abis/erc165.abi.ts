import { AbiType, StateMutabilityType } from '@core/layer-2'
import { ContractAbi } from 'web3'

export const ERC165_ABI: ContractAbi = [
    // / @notice Query if a contract implements an interface
    // / @param interfaceID The interface identifier, as specified in ERC-165
    // / @dev Interface identification is specified in ERC-165. This function
    // /  uses less than 30,000 gas.
    // / @return `true` if the contract implements `interfaceID` and
    // /  `interfaceID` is not 0xffffffff, `false` otherwise
    // /
    // / function supportsInterface(bytes4 interfaceID) external view returns(bool);
    {
        type: AbiType.Function,
        name: 'supportsInterface',
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },
]
