<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    interface IButtonProps {
        text: string
        disabled: boolean
        hidden: boolean
        onClick: (() => unknown) | undefined
    }

    const DEFAULT_CONTINUE_BUTTON: IButtonProps = {
        text: localize('actions.continue'),
        disabled: false,
        hidden: false,
        onClick: undefined,
    }

    const DEFAULT_BACK_BUTTON: IButtonProps = {
        text: localize('actions.back'),
        disabled: false,
        hidden: false,
        onClick: undefined,
    }

    export let title: string | undefined = undefined
    export let description: string | undefined = undefined
    export let continueButton: Partial<IButtonProps> | undefined = DEFAULT_CONTINUE_BUTTON
    export let backButton: Partial<IButtonProps> | undefined = DEFAULT_BACK_BUTTON
    export let busy: boolean = false

    $: _continueButton = { ...DEFAULT_CONTINUE_BUTTON, ...continueButton }
    $: _backButton = { ...DEFAULT_BACK_BUTTON, ...backButton }
</script>

<popup-template class="flex flex-col space-y-6 p-6">
    <content-title class="h-full flex flex-col space-y-2.5">
        {#if title}<Text type="h6">{title}</Text>{/if}
        {#if description}<Text type="body2" textColor="secondary">{description}</Text>{/if}
    </content-title>
    <slot />
    <content-buttons class="block flex flex-row space-x-6">
        {#if !_backButton.hidden}
            <Button
                width="full"
                variant="outlined"
                disabled={busy || _backButton.disabled || !_backButton.onClick}
                on:click={_backButton.onClick}
                text={_backButton.text}
            />
        {/if}
        {#if !_continueButton.hidden}
            <Button
                width="full"
                variant="contained"
                disabled={_continueButton.disabled || !_continueButton.onClick}
                {busy}
                on:click={_continueButton.onClick}
                text={_continueButton.text}
            />
        {/if}
    </content-buttons>
</popup-template>

<style lang="scss">
</style>
