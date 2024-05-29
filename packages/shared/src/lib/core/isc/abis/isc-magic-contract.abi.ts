import { ISC_MAGIC_CONTRACT_ACCOUNTS_ABI } from './isc-magic-contract-accounts.abi'
import { ISC_MAGIC_CONTRACT_SANDBOX_ABI } from './isc-magic-contract-sandbox.abi'

export const ISC_MAGIC_CONTRACT_ABI = [...ISC_MAGIC_CONTRACT_SANDBOX_ABI, ...ISC_MAGIC_CONTRACT_ACCOUNTS_ABI]
