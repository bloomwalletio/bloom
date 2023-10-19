<script lang="ts" context="module">
    interface IBaseButtonProps {
        text: string
        color?: 'primary' | 'success' | 'danger' | 'info' | 'warning'
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

    export type ButtonProps = IFormButtonProps | Omit<IButtonProps, 'type'>
    export type ButtonPropsWithType = IFormButtonProps | IButtonProps
</script>

<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { HTMLButtonType } from '@ui'

    const DEFAULT_CONTINUE_BUTTON: {
        type: HTMLButtonType.Button
        text: string
        color: 'primary' | 'success' | 'danger' | 'info' | 'warning'
    } = {
        type: HTMLButtonType.Button,
        text: localize('actions.continue'),
        color: 'primary',
    }

    const DEFAULT_BACK_BUTTON: {
        type: HTMLButtonType.Button
        text: string
        color: 'primary' | 'success' | 'danger' | 'info' | 'warning'
    } = {
        type: HTMLButtonType.Button,
        text: localize('actions.back'),
        color: 'primary',
    }

    export let title: string | undefined = undefined
    export let description: string | undefined = undefined
    export let continueButton: ButtonProps | undefined = undefined
    export let backButton: ButtonProps | undefined = undefined
    export let busy: boolean = false

    let _continueButton: ButtonPropsWithType
    let _backButton: ButtonPropsWithType
    $: _continueButton = { ...DEFAULT_CONTINUE_BUTTON, ...continueButton }
    $: _backButton = { ...DEFAULT_BACK_BUTTON, ...backButton }
</script>

<popup-template class="flex flex-col gap-6">
    <popup-header class="flex flex-col space-y-2.5">
        <title-row class="flex flex-row space-x-2 justify-between">
            {#if title}<Text type="h6">{title}</Text>{/if}
            {#if $$slots.menu}
                <slot name="menu" class="flex-0" />
            {/if}
        </title-row>
        {#if $$slots.description}
            <slot name="description" />
        {:else if description}
            <Text type="body2" textColor="secondary">{description}</Text>
        {/if}
    </popup-header>
    {#if $$slots.default}
        <slot />
    {/if}
    {#if backButton || continueButton}
        <popup-footer class="block flex flex-row space-x-3">
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
                    color={_continueButton.color}
                    text={_continueButton.text}
                    disabled={_continueButton.disabled}
                    {busy}
                    width="full"
                    form={_continueButton.type === HTMLButtonType.Submit ? _continueButton.form : undefined}
                    on:click={_continueButton.type === HTMLButtonType.Button && _continueButton.onClick}
                    {..._continueButton.restProps}
                />
            {/if}
        </popup-footer>
    {/if}
</popup-template>

<style lang="postcss">
    title-row {
        margin-right: 28px;
    }
</style>
