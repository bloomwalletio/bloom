import { ERC20_ABI, ERC721_ABI, ISC_SANDBOX_ABI } from '../abis'
import { ContractType } from '../enums'
import { Abi } from '../types'

export const EVM_CONTRACT_ABIS: { [key in ContractType]: Abi } = {
    [ContractType.Erc20]: ERC20_ABI,
    [ContractType.Erc721]: ERC721_ABI,
    [ContractType.IscMagic]: ISC_SANDBOX_ABI,
}
