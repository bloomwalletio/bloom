import { showNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { ActivityAction } from '@core/activity/enums'
import { addActivityToAccountActivitiesInAllAccountActivities } from '@core/activity/stores'
import { NftActivity } from '@core/activity/types'
import { generateSingleNftActivity } from '@core/activity/utils/generateSingleNftActivity'
import { preprocessTransaction } from '@core/activity/utils/outputs'
import { localize } from '@core/i18n'
import { IIrc27Metadata } from '@core/nfts'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts/actions'
import { Converter } from '@core/utils'
import { MintNftParams, OutputType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { resetMintNftDetails } from '../stores'

export async function mintNft(metadata: IIrc27Metadata, quantity: number): Promise<void> {
    try {
        const account = get(selectedAccount)
        if (!account) {
            return
        }

        updateSelectedAccount({ isTransferring: true })

        const mintNftParams: MintNftParams = {
            issuer: account.depositAddress,
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }
        const allNftParams: MintNftParams[] = Array(quantity).fill(mintNftParams)

        // Mint NFT
        const mintNftTransaction = await account.mintNfts(allNftParams, DEFAULT_TRANSACTION_OPTIONS)
        resetMintNftDetails()
        showNotification({
            variant: 'success',
            text: localize('notifications.mintNft.success'),
        })

        const processedTransaction = await preprocessTransaction(mintNftTransaction, account)
        const outputs = processedTransaction.outputs

        // Generate Activities
        for (const output of outputs) {
            if (output.output.type === OutputType.Nft) {
                // For each minted NFT, generate a new activity
                const activity: NftActivity = generateSingleNftActivity(account, {
                    action: ActivityAction.Mint,
                    processedTransaction,
                    wrappedOutput: output,
                }) as NftActivity
                addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)

                // Store NFT metadata for each minted NFT
                const nft = buildNftFromNftOutput(output, account.depositAddress, false)
                addOrUpdateNftInAllAccountNfts(account.index, nft)
            }
        }
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
