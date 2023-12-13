<script lang="ts">
    import { TextInput } from '@bloomwalletio/ui'
    import { NetworkInput } from '@ui'
    import { localize } from '@core/i18n'
    import { getEvmTokenMetadata } from '@core/layer-2/utils'
    import { NetworkId } from '@core/network'
    import { validateEthereumAddress } from '@core/utils'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { showNotification } from '@auxiliary/notification'
    import { addNewTrackedTokenToActiveProfile } from '@core/wallet'
    import { IErc20Metadata, TokenTrackingStatus } from '@core/token'

    let busy = false

    let networkId: NetworkId

    let tokenAddress: string
    let tokenAddressError = ''
    $: tokenAddress, (tokenAddressError = '')

    function onCancelClick(): void {
        closePopup()
    }

    async function onImportClick(): Promise<void> {
        busy = true
        const _tokenAddress = tokenAddress.toLowerCase()
        try {
            validateEthereumAddress(_tokenAddress)

            const erc20TokenMetadata = (await getEvmTokenMetadata(_tokenAddress, networkId)) as IErc20Metadata
            if (erc20TokenMetadata) {
                addNewTrackedTokenToActiveProfile(
                    networkId,
                    _tokenAddress,
                    erc20TokenMetadata,
                    TokenTrackingStatus.ManuallyTracked
                )
                showNotification({
                    variant: 'success',
                    text: localize('popups.importToken.success', {
                        values: { tokenSymbol: erc20TokenMetadata.symbol },
                    }),
                })
                closePopup()
            }
        } catch (err) {
            tokenAddressError = err
        }
        busy = false
    }
</script>

<PopupTemplate
    title={localize('popups.importToken.title', { values: { type: 'ERC-20' } })}
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
    <form on:submit|preventDefault id="import-erc20-token-form" class="space-y-4 max-h-100 flex-1">
        <NetworkInput bind:networkId showLayer1={false} />
        <TextInput
            bind:value={tokenAddress}
            label={localize('popups.importToken.property.tokenAddress')}
            error={tokenAddressError}
        />
    </form>
</PopupTemplate>
