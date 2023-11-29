import { showNotification } from '@auxiliary/notification'
import { getSelectedAccount, updateSelectedAccount } from '@core/account/stores'
import { ActivityAction } from '@core/activity/enums'
import { addAccountActivity } from '@core/activity/stores'
import { sendPreparedTransaction } from '@core/wallet/utils'
import { NftActivity } from '@core/activity/types'
import { generateSingleNftActivity } from '@core/activity/utils/generateSingleNftActivity'
import { preprocessTransaction } from '@core/activity/utils/outputs'
import { localize } from '@core/i18n'
import { IIrc27Metadata } from '@core/nfts'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts/actions'
import { Converter } from '@core/utils'
import { AliasOutputParams, OutputType } from '@iota/sdk/out/types'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { resetMintNftDetails } from '../stores'
import { getActiveNetworkId } from '@core/network'

export async function mintNftCollection(metadata: IIrc27Metadata): Promise<void> {
    try {
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        updateSelectedAccount({ isTransferring: true })

        const mintNftCollectionParams: AliasOutputParams = {
            // issuer: account.depositAddress, // TODO: uncomment when added to iota-sdk
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }

        // Mint NFT
        const preparedTransaction = await account.prepareCreateAliasOutput(
            mintNftCollectionParams,
            DEFAULT_TRANSACTION_OPTIONS
        )
        const mintNftTransaction = await sendPreparedTransaction(preparedTransaction)
        resetMintNftDetails()
        showNotification({
            variant: 'success',
            text: localize('notifications.mintNft.success'),
        })

        const processedTransaction = await preprocessTransaction(mintNftTransaction, account)
        const outputs = processedTransaction.outputs

        // TODO: generate activity for minting NFT collection
        // Generate Activities
        for (const output of outputs) {
            if (output.output?.type === OutputType.Nft) {
                // For each minted NFT, generate a new activity
                const activity: NftActivity = (await generateSingleNftActivity(account, networkId, {
                    action: ActivityAction.Mint,
                    processedTransaction,
                    wrappedOutput: output,
                })) as NftActivity
                addAccountActivity(account.index, activity)

                // Store NFT metadata for each minted NFT
                const nft = buildNftFromNftOutput(output, networkId, account.depositAddress, false)
                addOrUpdateNftInAllAccountNfts(account.index, nft)
            }
        }
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
