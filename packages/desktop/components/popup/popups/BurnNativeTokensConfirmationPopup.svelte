<script lang="ts">
    import { Alert, Table } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { ITokenWithBalance, formatTokenAmount } from '@core/token'
    import { burnToken } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let token: ITokenWithBalance
    export let rawAmount: bigint

    $: formattedAmount = formatTokenAmount(rawAmount, token?.metadata)

    function onBackClick(): void {
        openPopup({
            id: PopupId.BurnNativeTokens,
            props: { token, rawAmount },
        })
    }

    async function onBurnTokenClick(): Promise<void> {
        try {
            await checkActiveProfileAuth()
        } catch (err) {
            return
        }

        await burnToken(token.id, rawAmount)
        closePopup()
    }
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
