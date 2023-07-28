import { buildBip32Path, getSelectedAccount } from '@core/account'
import { ContractType, ISC_MAGIC_CONTRACT_ADDRESS, buildEvmTransactionData } from '@core/layer-2'
import { ChainId, network } from '@core/network'
import { Bech32Helper } from '@core/utils'
import { get } from 'svelte/store'
import Web3 from 'web3'

export async function unwrapIrc30Token(amount: number, originAddress: string, recipientAddress: string): Promise<void> {
    // 1. Build send parameters
    const parameters = buildUnwrapIrc30TokenParameters(amount, recipientAddress)

    // 2. Encode data from send parameters with the Contract object
    const chain = get(network)?.getChain(ChainId.ShimmerEVM)
    const contract = chain?.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
    const data = await contract?.methods.send(...parameters).encodeABI() ?? ''
    /* eslint-disable no-console */
    console.log('raw tx data: ', data)

    const transactionData = await buildEvmTransactionData(chain?.getProvider() as Web3, originAddress, ISC_MAGIC_CONTRACT_ADDRESS, amount.toString(), data)
    console.log('tx data: ', transactionData)
    
    const bip32Path = buildBip32Path(chain?.getConfiguration().coinType, getSelectedAccount()?.index, 0, false)
    const signedTransactionHex = await signTransactionWithLedger(transactionData, bip32Path)
    console.log('signed tx: ', signedTransactionHex)
}


export function buildUnwrapIrc30TokenParameters(amount: number, recipientAddress: string): UnwrapIrc30Parameter[] {
    // 1. Build target address parameter
    // 1. Convert L1 bech32 address to Ed25519 in bytes with prepended `0` byte
    const hrp = get(network)?.getMetadata().protocol.bech32Hrp ?? ''
    const { addressBytes } = Bech32Helper.fromBech32(recipientAddress, hrp)
    console.log({addressBytes})
    const targetAddressParameter: IUnwrapIrc30TargetAddressParameter = {
        data: new Uint8Array([0, ...addressBytes]),
    }

    const assetParameters: IUnwrapIrc30AssetParameters = {
        baseTokens: amount,
        nativeTokens: [],
        nfts: [],
    }

    const sendMetadataParameter: IUnwrapIrc30SendMetadataParameter = {
        targetContract: 0,
        entrypoint: 0,
        params: {
            items: [],
        },
        allowance: {
            baseTokens: 0,
            nativeTokens: [],
            nfts: [],
        },
        gasBudget: 0,
    }

    const sendOptionsParameter: IUnwrapIrc30SendOptionsParameter = {
        timelock: 0,
        expiration: {
            time: 0,
            returnAddress: {
                data: new Uint8Array(),
            },
        },
    }

    return [
        {
            ...targetAddressParameter,
        },
        {
            ...assetParameters,
        },
        false,
        {
            ...sendMetadataParameter,
        },
        {
            ...sendOptionsParameter,
        },
    ]

}

export type UnwrapIrc30Parameter =
    | IUnwrapIrc30TargetAddressParameter
    | IUnwrapIrc30AssetParameters
    | UnwrapIrc30AdjustMinimumStorageDepositParameter
    | IUnwrapIrc30SendMetadataParameter
    | IUnwrapIrc30SendOptionsParameter

export interface IUnwrapIrc30TargetAddressParameter {
    data: Uint8Array
}

export interface IUnwrapIrc30AssetParameters {
    baseTokens: number
    nativeTokens: IUnwrapIrc30NativeTokenParameter[]
    nfts: string[]
}

export interface IUnwrapIrc30NativeTokenParameter {
    ID: { data: Uint8Array }[]
    amount: number
}

export type UnwrapIrc30AdjustMinimumStorageDepositParameter = boolean

export interface IUnwrapIrc30SendMetadataParameter {
    targetContract: number
    entrypoint: number
    params: IUnwrapIrc30SendMetadataParamsParameter
    allowance: IUnwrapIrc30AssetParameters
    gasBudget: number
}

export interface IUnwrapIrc30SendMetadataParamsParameter {
    items: {
        key: Uint8Array
        value: Uint8Array
    } | []
}

export interface IUnwrapIrc30SendOptionsParameter {
    timelock: number
    expiration: IUnwrapIrc30SendOptionsExpirationParameter
}

export interface IUnwrapIrc30SendOptionsExpirationParameter {
    time: number
    returnAddress: {
        data: Uint8Array
    }
}
