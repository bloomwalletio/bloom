import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { EvmActivityType } from '@core/activity/enums/evm'
import { ParsedSmartContractType } from '@core/layer-2/enums'
import { IParsedInput } from '@core/layer-2/interfaces'
import { addMethodToRegistry, getMethodFromRegistry } from '@core/layer-2/stores/method-registry.store'
import { parseSmartContractDataFromTransactionData } from '@core/layer-2/utils'
import { IEvmNetwork } from '@core/network'
import { NftStandard } from '@core/nfts/enums'
import { BASE_TOKEN_ID } from '@core/token'
import { TokenStandard } from '@core/token/enums'
import { HEX_PREFIX } from '@core/utils'

export function getSmartContractDataFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    evmNetwork: IEvmNetwork
): { type; method; inputs; baseTokenTransfer; tokenTransfer } {
    let type = EvmActivityType.ContractCall
    let method: string | undefined
    let inputs: IParsedInput[] | undefined
    let baseTokenTransfer:
        | {
              tokenId: string
              rawAmount: bigint
          }
        | undefined
    let tokenTransfer:
        | {
              standard: TokenStandard.Erc20 | TokenStandard.Irc30 | NftStandard.Irc27 | NftStandard.Erc721
              tokenId: string
              rawAmount: bigint
          }
        | undefined

    if (blockscoutTransaction.decoded_input) {
        // if decoded input is available we know the method and parameters and contract is verified
        const { method_id, method_call, parameters } = blockscoutTransaction.decoded_input
        method = blockscoutTransaction.method
        inputs = Object.keys(parameters).map((key) => ({
            name: key,
            type: parameters[key],
            value: undefined,
        }))

        if (!getMethodFromRegistry(HEX_PREFIX + method_id)) {
            const fourBytePrefix = HEX_PREFIX + method_id
            addMethodToRegistry(fourBytePrefix, method_call)
        }
    } else if (blockscoutTransaction?.raw_input) {
        const parsedData = parseSmartContractDataFromTransactionData(
            {
                to: blockscoutTransaction.to.hash.toLowerCase(),
                data: blockscoutTransaction.raw_input,
                value: blockscoutTransaction.value,
            },
            evmNetwork
        )
        method = parsedData?.parsedMethod?.name
        inputs = parsedData?.parsedMethod?.inputs

        switch (parsedData?.type) {
            case ParsedSmartContractType.CoinTransfer:
                type = EvmActivityType.CoinTransfer
                baseTokenTransfer = {
                    tokenId: BASE_TOKEN_ID,
                    rawAmount: parsedData.rawAmount,
                }
                break
            case ParsedSmartContractType.TokenTransfer:
                type = EvmActivityType.TokenTransfer

                tokenTransfer = {
                    standard: parsedData.standard,
                    tokenId: parsedData.tokenId,
                    rawAmount: parsedData.rawAmount,
                }
                break
            case ParsedSmartContractType.NftTransfer:
                type = EvmActivityType.TokenTransfer

                tokenTransfer = {
                    standard: parsedData.standard,
                    tokenId: parsedData.nftId,
                    rawAmount: BigInt(1),
                }
                break
            case ParsedSmartContractType.SmartContract:
                type = EvmActivityType.ContractCall
                break
        }
    }

    return { type, method, inputs, baseTokenTransfer, tokenTransfer }
}
