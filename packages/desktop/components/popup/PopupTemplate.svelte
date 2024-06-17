<script lang="ts" context="module">
    interface IBaseButtonProps {
        text: string
        color?: 'primary' | 'success' | 'danger' | 'info' | 'warning'
        disabled?: boolean
        restProps?: Record<string, unknown> | undefined
    }

    interface IFormButtonProps extends IBaseButtonProps {
        type: 'submit'
        form?: string
    }

    interface IButtonProps extends IBaseButtonProps {
        type: 'button'
        onClick: (() => unknown) | undefined
    }

    export type ButtonProps = IFormButtonProps | Omit<IButtonProps, 'type'>
    export type ButtonPropsWithType = IFormButtonProps | IButtonProps
</script>

<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    const DEFAULT_CONTINUE_BUTTON: {
        type: 'button'
        text: string
        color: 'primary' | 'success' | 'danger' | 'info' | 'warning'
    } = {
        type: 'button',
        text: localize('actions.continue'),
        color: 'primary',
    }

    const DEFAULT_BACK_BUTTON: {
        type: 'button'
        text: string
        color: 'primary' | 'success' | 'danger' | 'info' | 'warning'
    } = {
        type: 'button',
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

<popup-template>
    <div class="popup-banner overflow-hidden rounded-t-[32px]">
        <slot name="banner" />
    </div>
    <popup-content class="max-h-[90vh] flex flex-col gap-6 p-8" class:pt-4={$$slots.banner}>
        {#if title || $$slots.menu || $$slots.description || description}
            <popup-header class="flex-none flex flex-col gap-2.5">
                <title-row class="flex flex-row gap-2 mr-7 justify-between">
                    {#if title}<Text type="h6" truncate>{title}</Text>{/if}
                    {#if $$slots.menu}
                        <slot name="menu" class="flex-0" />
                    {/if}
                </title-row>
                {#if $$slots.description}
                    <slot name="description" />
                {:else if description}
                    <Text type="body2" textColor="secondary" class="break-words">{description}</Text>
                {/if}
            </popup-header>
        {/if}
        {#if $$slots.default || $$slots.content}
            <div class="flex-1 h-0 flex flex-col">
                {#if $$slots.default}
                    <slot />
                {:else if $$slots.content}
                    <slot name="content" />
                {/if}
            </div>
        {/if}
        {#if backButton || continueButton}
            <popup-footer class="flex-none flex flex-row gap-3">
                {#if backButton}
                    <Button
                        type="button"
                        variant="outlined"
                        text={_backButton.text}
                        disabled={busy || _backButton.disabled}
                        width="full"
                        form={_backButton.type === 'submit' ? _backButton.form : undefined}
                        on:click={_backButton.type === 'button' ? _backButton.onClick : undefined}
                        {..._backButton.restProps}
                    />
                {/if}
                {#if continueButton}
                    <Button
                        type={_continueButton.form ? 'submit' : 'button'}
                        form={_continueButton.form}
                        variant="contained"
                        color={_continueButton.color}
                        text={_continueButton.text}
                        disabled={_continueButton.disabled}
                        {busy}
                        width="full"
                        on:click={_continueButton.type === 'button' ? _continueButton.onClick : undefined}
                        {..._continueButton.restProps}
                    />
                {/if}
            </popup-footer>
        {/if}
    </popup-content>
</popup-template>
