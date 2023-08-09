<script lang="ts">
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { IToken, formatTokenAmountBestMatch } from '@core/token'
    import { burnToken } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { Button, ButtonVariant, FontWeight, KeyValueBox, Text, TextHint, TextType } from '@ui'
    import { onMount } from 'svelte'

    export let token: IToken
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

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('actions.confirmTokenBurn.title', {
            values: {
                assetName: token?.metadata.name,
            },
        })}
    </Text>
    <div class="space-y-4">
        <KeyValueBox keyText={localize('popups.nativeToken.property.tokenId')} valueText={token.id} isCopyable />
        <KeyValueBox keyText={localize('general.amount')} valueText={formattedAmount} />
        <TextHint warning text={localize('actions.confirmTokenBurn.hint')} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBackClick}>{localize('actions.back')}</Button>
        <Button
            classes="w-full"
            variant={ButtonVariant.Warning}
            isBusy={$selectedAccount.isTransferring}
            disabled={$selectedAccount.isTransferring}
            onClick={onBurnTokenClick}
        >
            {localize('actions.burnToken')}
        </Button>
    </popup-buttons>
</div>
