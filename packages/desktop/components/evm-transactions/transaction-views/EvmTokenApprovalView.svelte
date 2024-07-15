<script lang="ts">
    import { localize } from '@core/i18n'
    import PopupTemplate, { ButtonProps } from '@components/popup/PopupTemplate.svelte'
    import EvmTokenApprovalAlert from '../EvmTokenApprovalAlert.svelte'
    import { EvmNetworkId } from '@core/network/types'
    import { IParsedTokenApproval } from '@core/layer-2'
    import { TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import { Alert, Checkbox } from '@bloomwalletio/ui'
    import { truncateString } from '@core/utils'
    import { getTokenFromSelectedAccountTokens, selectedAccountTokens } from '@core/token/stores'
    import { ITokenWithBalance } from '@core/token'

    export let parsedTokenApproval: IParsedTokenApproval
    export let baseCoinTransfer: TokenTransferData
    export let dappName: string | undefined
    export let continueButton: ButtonProps
    export let backButton: ButtonProps
    export let networkId: EvmNetworkId
    export let busy = false

    let bypassSecurityWarning = false

    $: tokens = [
        $selectedAccountTokens?.[networkId]?.baseCoin,
        ...($selectedAccountTokens?.[networkId]?.nativeTokens ?? []),
    ].filter(Boolean) as ITokenWithBalance[]
    $: tokenBalance = tokens.find((token) => token.id === parsedTokenApproval.tokenId)?.balance.available ?? BigInt(0)
    $: hasSecurityWarning = baseCoinTransfer.rawAmount > BigInt(0) || parsedTokenApproval.rawAmount > tokenBalance

    const token = getTokenFromSelectedAccountTokens(parsedTokenApproval.tokenId, networkId)
    const localeKey = 'popups.tokenApproval'
</script>

<PopupTemplate
    title={localize(`${localeKey}.title`, {
        assetName: token?.metadata?.name ?? truncateString(parsedTokenApproval.tokenId, 6, 6),
    })}
    {backButton}
    continueButton={{
        ...continueButton,
        text: localize(`${localeKey}.action`),
        disabled: continueButton.disabled || (hasSecurityWarning && !bypassSecurityWarning),
    }}
    {busy}
>
    <svelte:fragment slot="banner">
        {#if $$slots.dappHeader}
            <slot name="dappHeader" />
        {/if}
    </svelte:fragment>
    <div class="flex flex-col space-y-5">
        <TransactionAssetSection {baseCoinTransfer} />
        <EvmTokenApprovalAlert {parsedTokenApproval} {networkId} {dappName} />
        <slot name="transactionDetails" />
        {#if baseCoinTransfer.rawAmount > BigInt(0)}
            <!-- Display alert if token approval is also trying to consume value -->
            <Alert variant="danger" text="Beware this approval transaction is also trying to consume base tokens!" />
        {:else if parsedTokenApproval.rawAmount > tokenBalance}
            <Alert variant="warning" text={localize(`${localeKey}.approveMoreThanBalanceWarning`)}>
                <checkbox-container slot="body">
                    <Checkbox label={localize(`${localeKey}.accept`)} bind:checked={bypassSecurityWarning} />
                </checkbox-container>
            </Alert>
        {/if}
    </div>
</PopupTemplate>
