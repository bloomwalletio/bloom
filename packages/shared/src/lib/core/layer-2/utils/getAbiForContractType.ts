import { ERC20_ABI, ERC721_ABI, ISC_SANDBOX_ABI } from '../abis'
import { ContractType } from '../enums'
import { Abi } from '../types'

export function getAbiForContractType(type: ContractType): Abi {
    switch (type) {
        case ContractType.IscMagic:
            return ISC_SANDBOX_ABI
        case ContractType.Erc20:
            return ERC20_ABI
        case ContractType.Erc721:
            return ERC721_ABI
        default:
            return []
    }
}
