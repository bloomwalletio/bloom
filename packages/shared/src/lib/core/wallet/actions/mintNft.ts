import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { ActivityAction } from '@core/activity/enums'
import { addAccountActivity } from '@core/activity/stores'
import { sendPreparedTransaction } from '@core/wallet/utils'
import { StardustNftActivity } from '@core/activity/types'
import { generateSingleNftActivity } from '@core/activity/utils/stardust/generateSingleNftActivity'
import { preprocessTransaction } from '@core/activity/utils/outputs'
import { localize } from '@core/i18n'
import { IIrc27Metadata } from '@core/nfts'
import { buildNftFromNftOutput } from '@core/nfts/actions'
import { Converter } from '@core/utils'
import { MintNftParams, OutputType } from '@iota/sdk/out/types'
import { getTransactionOptions } from '../utils'
import { resetMintNftDetails } from '../stores'
import { getActiveNetworkId } from '@core/network'
import { addOrUpdateNftForAccount } from '@core/nfts/stores'

export async function mintNft(
    metadata: IIrc27Metadata,
    startIndex: number,
    quantity: number,
    collectionId?: string
): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ isTransferring: true })

        const allNftParams: MintNftParams[] = []
        for (let i = startIndex; i < startIndex + quantity; i++) {
            const updatedMetadata = {
                ...metadata,
                name: metadata.name.replace('{id}', i.toString()),
                description: metadata.description?.replace('{id}', i.toString()),
                uri: metadata.uri.replace('{id}', i.toString()),
            }
            const mintNftParams: MintNftParams = {
                address: account.depositAddress,
                issuer: collectionId || account.depositAddress,
                immutableMetadata: Converter.utf8ToHex(JSON.stringify(updatedMetadata)),
            }
            allNftParams.push(mintNftParams)
        }

        // Mint NFT
        const preparedTransaction = await account.prepareMintNfts(
            allNftParams,
            getTransactionOptions(account.depositAddress)
        )
        const mintNftTransaction = await sendPreparedTransaction(preparedTransaction)
        resetMintNftDetails()
        showNotification({
            variant: 'success',
            text: localize('notifications.mintNft.success'),
        })

        const processedTransaction = await preprocessTransaction(mintNftTransaction, account)
        const outputs = processedTransaction.outputs

        // Generate Activities
        for (const output of outputs) {
            if (output.output?.type === OutputType.Nft) {
                // For each minted NFT, generate a new activity
                const activity: StardustNftActivity = (await generateSingleNftActivity(account, networkId, {
                    action: ActivityAction.Mint,
                    processedTransaction,
                    wrappedOutput: output,
                })) as StardustNftActivity
                addAccountActivity(account.index, activity)

                // Store NFT metadata for each minted NFT
                const nft = buildNftFromNftOutput(output, networkId, account.depositAddress, false)
                addOrUpdateNftForAccount(account.index, nft)
            }
        }
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
