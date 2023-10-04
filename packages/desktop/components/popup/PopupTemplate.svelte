<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { HTMLButtonType } from '@ui'
    interface IBaseButtonProps {
        text: string
        disabled?: boolean
        restProps?: Record<string, unknown> | undefined
    }

    interface IFormButtonProps extends IBaseButtonProps {
        type: HTMLButtonType.Submit
        form: string
    }

    interface IButtonProps extends IBaseButtonProps {
        type: HTMLButtonType.Button
        onClick: (() => unknown) | undefined
    }

    type ButtonProps = IFormButtonProps | Omit<IButtonProps, 'type'>

    const DEFAULT_CONTINUE_BUTTON = {
        type: HTMLButtonType.Button,
        text: localize('actions.continue'),
    }

    const DEFAULT_BACK_BUTTON = {
        type: HTMLButtonType.Button,
        text: localize('actions.back'),
    }

    export let title: string | undefined = undefined
    export let description: string | undefined = undefined
    export let continueButton: ButtonProps | undefined = undefined
    export let backButton: ButtonProps | undefined = undefined
    export let busy: boolean = false

    $: _continueButton = { ...DEFAULT_CONTINUE_BUTTON, ...continueButton }
    $: _backButton = { ...DEFAULT_BACK_BUTTON, ...backButton }
</script>

<popup-template class="flex flex-col space-y-6">
    <popup-title class="h-full flex flex-col space-y-2.5">
        {#if title}<Text type="h6">{title}</Text>{/if}
        {#if $$slots.description}
            <slot name="description" />
        {:else if description}
            <Text type="body2" textColor="secondary">{description}</Text>
        {/if}
    </popup-title>
    <popup-content>
        <slot />
    </popup-content>
    {#if backButton || continueButton}
        <popup-buttons class="block flex flex-row space-x-6">
            {#if backButton}
                <Button
                    type={_backButton.type}
                    variant="outlined"
                    text={_backButton.text}
                    disabled={busy || _backButton.disabled}
                    width="full"
                    form={_backButton.type === HTMLButtonType.Submit ? _backButton.form : undefined}
                    on:click={_backButton.type === HTMLButtonType.Button && _backButton.onClick}
                    {..._backButton.restProps}
                />
            {/if}
            {#if continueButton}
                <Button
                    type={_continueButton.type}
                    variant="contained"
                    text={_continueButton.text}
                    disabled={_continueButton.disabled}
                    {busy}
                    width="full"
                    form={_continueButton.type === HTMLButtonType.Submit ? _continueButton.form : undefined}
                    on:click={_continueButton.type === HTMLButtonType.Button && _continueButton.onClick}
                    {..._continueButton.restProps}
                />
            {/if}
        </popup-buttons>
    {/if}
</popup-template>

<style lang="scss">
</style>
