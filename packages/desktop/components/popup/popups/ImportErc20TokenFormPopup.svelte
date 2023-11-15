<script lang="ts">
    import { TextInput } from '@bloomwalletio/ui'
    import { NetworkInput } from '@ui'
    import { localize } from '@core/i18n'
    import { ETHEREUM_ADDRESS_LENGTH } from '@core/layer-2'
    import { getErc20TokenMetadata } from '@core/layer-2/utils'
    import { NetworkId, network } from '@core/network'
    import { HEX_PREFIX, HEXADECIMAL_REGEXP } from '@core/utils'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { showNotification } from '@auxiliary/notification'
    import { addNewTrackedTokenToActiveProfile } from '@core/wallet'

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
        if (validate(_tokenAddress)) {
            try {
                const erc20TokenMetadata = await getErc20TokenMetadata(_tokenAddress, networkId, $network)
                if (erc20TokenMetadata) {
                    addNewTrackedTokenToActiveProfile(networkId, _tokenAddress, erc20TokenMetadata)
                    showNotification({
                        variant: 'success',
                        text: localize('popups.importErc20Token.success', {
                            values: { tokenSymbol: erc20TokenMetadata.symbol },
                        }),
                    })
                    closePopup()
                }
            } catch (err) {
                console.error(err)
                showNotification({
                    variant: 'error',
                    text: localize('popups.importErc20Token.error'),
                })
            }
        }

        busy = false
    }

    function validate(tokenAddress: string): boolean {
        const hasHexPrefix = tokenAddress?.startsWith(HEX_PREFIX)
        const isValidHex = HEXADECIMAL_REGEXP.test(tokenAddress)
        const addressLength = tokenAddress?.substring(2)?.length

        if (!hasHexPrefix || !isValidHex) {
            tokenAddressError = localize('error.erc20Token.invalidAddressFormat')
        } else if (addressLength !== ETHEREUM_ADDRESS_LENGTH) {
            tokenAddressError = localize('error.erc20Token.invalidAddressLength')
        }
        return !tokenAddressError
    }
</script>

<PopupTemplate
    title={localize('popups.importErc20Token.title')}
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
    <form on:submit|preventDefault={onImportClick} id="import-erc20-token-form" class="space-y-4 max-h-100 flex-1">
        <NetworkInput bind:networkId showLayer1={false} />
        <TextInput
            bind:value={tokenAddress}
            label={localize('popups.importErc20Token.property.tokenAddress')}
            error={tokenAddressError}
        />
    </form>
</PopupTemplate>
