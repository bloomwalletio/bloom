<script lang="ts">
    import { TextInput } from '@bloomwalletio/ui'
    import { NetworkInput } from '@ui'
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { validateEthereumAddress } from '@core/utils'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { showNotification } from '@auxiliary/notification'
    import { loadNftsForAccount, persistErc721Nft } from '@core/nfts/actions'
    import { selectedAccount } from '@core/account/stores'

    let busy = false

    let networkId: NetworkId

    let tokenAddress: string
    let tokenAddressError = ''
    $: tokenAddress, (tokenAddressError = '')

    let tokenId: string

    function onCancelClick(): void {
        closePopup()
    }

    async function onImportClick(): Promise<void> {
        busy = true
        try {
            validateEthereumAddress(tokenAddress)
            const persistedErc721Nft = await persistErc721Nft(tokenAddress, tokenId, networkId)
            if (!persistedErc721Nft) {
                throw new Error('Already added')
            }
            await loadNftsForAccount($selectedAccount)
            showNotification({
                variant: 'success',
                text: localize('popups.importToken.success', {
                    values: { tokenSymbol: persistedErc721Nft.contractMetadata.symbol },
                }),
            })
            closePopup()
        } catch (err) {
            tokenAddressError = err
        }
        busy = false
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
        <TextInput
            bind:value={tokenAddress}
            label={localize('popups.importToken.property.tokenAddress')}
            error={tokenAddressError}
        />
        <TextInput bind:value={tokenId} label={localize('popups.nativeToken.tokenId')} error={tokenAddressError} />
    </form>
</PopupTemplate>
