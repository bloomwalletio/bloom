<script lang="ts">
    import { Alert, Table } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { burnToken } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let token: ITokenWithBalance
    export let rawAmount: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: formattedAmount = formatTokenAmountBestMatch(Number(rawAmount), token?.metadata)

    function onBackClick(): void {
        openPopup({
            id: PopupId.BurnNativeTokens,
            props: { token, rawAmount },
        })
    }

    async function onBurnTokenClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(
                async () => {
                    await burnToken(token.id, rawAmount)
                    closePopup()
                },
                { stronghold: true }
            )
        } catch (err) {
            console.error(err)
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<PopupTemplate
    title={localize('actions.confirmTokenBurn.title', {
        values: {
            assetName: token?.metadata.name,
        },
    })}
    backButton={{
        text: localize('actions.back'),
        onClick: onBackClick,
    }}
    continueButton={{
        text: localize('actions.burnToken'),
        onClick: onBurnTokenClick,
        disabled: $selectedAccount?.isTransferring,
        color: 'danger',
    }}
    busy={$selectedAccount?.isTransferring}
>
    <div class="space-y-5">
        <Table
            items={[
                {
                    key: localize('popups.nativeToken.property.tokenId'),
                    value: token.id,
                    copyable: true,
                },
                {
                    key: localize('general.amount'),
                    value: formattedAmount,
                },
            ]}
        />
        <Alert variant="warning" text={localize('actions.confirmTokenBurn.hint')} />
    </div>
</PopupTemplate>
