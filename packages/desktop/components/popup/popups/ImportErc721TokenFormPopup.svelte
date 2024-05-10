<script lang="ts">
    import { TextInput } from '@bloomwalletio/ui'
    import { NetworkInput } from '@ui'
    import { localize } from '@core/i18n'
    import { EvmNetworkId } from '@core/network'
    import { validateEthereumAddress } from '@core/utils'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { showNotification } from '@auxiliary/notification'
    import { addNftsToDownloadQueue, addNewTrackedNftToActiveProfile, persistErc721Nft } from '@core/nfts/actions'
    import { buildNftFromPersistedErc721Nft } from '@core/nfts/utils'
    import { activeAccounts } from '@core/profile/stores'
    import { getAddressFromAccountForNetwork } from '@core/account'
    import { TokenTrackingStatus } from '@core/token'
    import { selectedAccount } from '@core/account/stores'
    import { addOrUpdateNftForAccount } from '@core/nfts/stores'

    let busy = false

    let networkId: EvmNetworkId

    let tokenAddress: string

    let tokenId: string
    let tokenIdError = ''
    $: tokenId, tokenAddress, (tokenIdError = '')

    function onCancelClick(): void {
        closePopup()
    }

    async function onImportClick(): Promise<void> {
        busy = true
        try {
            validateEthereumAddress(tokenAddress)
            const persistedNft = await persistErc721Nft(tokenAddress, tokenId, networkId, $selectedAccount)
            if (!persistedNft) {
                throw new Error(localize('popups.importToken.errors.alreadyAdded'))
            }
            addNewTrackedNftToActiveProfile(networkId, persistedNft.id, TokenTrackingStatus.ManuallyTracked)

            for (const account of $activeAccounts) {
                const l2Address = getAddressFromAccountForNetwork(account, networkId)
                const nft = buildNftFromPersistedErc721Nft(persistedNft, l2Address)
                addOrUpdateNftForAccount(account.index, nft)
                void addNftsToDownloadQueue([nft])
            }

            showNotification({
                variant: 'success',
                text: localize('popups.importToken.success', {
                    values: { tokenSymbol: persistedNft.contractMetadata.symbol },
                }),
            })
            closePopup()
        } catch (err) {
            tokenIdError = err?.message ?? err
        } finally {
            busy = false
        }
    }
</script>

<PopupTemplate
    title={localize('popups.importToken.title', { values: { type: 'ERC-721' } })}
    {busy}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        form: 'import-erc20-token-form',
        text: localize('actions.import'),
        onClick: onImportClick,
        disabled: !networkId || !tokenAddress,
    }}
>
    <form on:submit|preventDefault class="space-y-4 max-h-100 flex-1">
        <NetworkInput bind:networkId showLayer1={false} />
        <TextInput bind:value={tokenAddress} label={localize('popups.importToken.property.tokenAddress')} />
        <TextInput bind:value={tokenId} label={localize('popups.nativeToken.property.tokenId')} error={tokenIdError} />
    </form>
</PopupTemplate>
