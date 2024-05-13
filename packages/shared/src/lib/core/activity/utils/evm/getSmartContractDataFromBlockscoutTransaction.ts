import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { EvmActivityType } from '@core/activity/enums/evm'
import { IParsedInput } from '@core/layer-2/interfaces'
import { addMethodToRegistry, getMethodFromRegistry } from '@core/layer-2/stores/method-registry.store'
import { parseSmartContractDataFromTransactionData } from '@core/layer-2/utils'
import { IEvmNetwork } from '@core/network'
import { HEX_PREFIX } from '@core/utils'

export function getSmartContractDataFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    evmNetwork: IEvmNetwork
): { type: EvmActivityType; method?: string; inputs?: IParsedInput[] } {
    let method: string | undefined
    let inputs: IParsedInput[] | undefined
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
    }

    return { type: EvmActivityType.ContractCall, method, inputs }
}
