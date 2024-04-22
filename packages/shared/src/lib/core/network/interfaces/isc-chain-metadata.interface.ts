import { IGasFeePolicy } from './gas-fee-policy.interface'
import { IGasLimits } from './gas-limits.interface'

export interface IIscChainMetadata {
    /**
     * CAUTION: This field is named incorrectly, as it should be
     * "chainId". See here for more: https://github.com/iotaledger/wasp/issues/2411
     */
    chainID: string
    evmChainId: number
    chainOwnerId: string
    isActive: boolean
    gasLimits: IGasLimits
    gasFeePolicy: IGasFeePolicy
    customMetadata: unknown
}
