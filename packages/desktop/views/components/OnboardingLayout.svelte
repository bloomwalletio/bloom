<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import BgGradient from './BgGradient.svelte'
    import LoggedOutLayout from './LoggedOutLayout.svelte'

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

    export let size: 'small' | 'medium' | 'large' | 'fit' = 'medium'
    export let title: string | undefined = undefined
    export let description: string | undefined = undefined
    export let continueButton: Partial<IButtonProps> | undefined = DEFAULT_CONTINUE_BUTTON
    export let backButton: Partial<IButtonProps> | undefined = DEFAULT_BACK_BUTTON
    export let busy: boolean = false

    $: _continueButton = { ...DEFAULT_CONTINUE_BUTTON, ...continueButton }
    $: _backButton = { ...DEFAULT_BACK_BUTTON, ...backButton }
</script>

<LoggedOutLayout>
    <BgGradient />
    <content-container class="flex flex-col w-full h-full items-center justify-center">
        <content class="flex flex-col w-full gap-6 {size}">
            <content-title class="flex flex-col space-y-2.5">
                {#if title}<Text type="h4" align="center">{title}</Text>{/if}
                {#if description}<Text type="body2" textColor="secondary" align="center">{description}</Text>{/if}
            </content-title>
            <slot name="content" />
            <content-buttons class="flex flex-row-reverse gap-3">
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
                {#if !_backButton.hidden}
                    <Button
                        width="full"
                        variant="outlined"
                        disabled={busy || _backButton.disabled || !_backButton.onClick}
                        on:click={_backButton.onClick}
                        text={_backButton.text}
                    />
                {/if}
            </content-buttons>
        </content>
    </content-container>
</LoggedOutLayout>

<style lang="scss">
    .header {
        height: 42px;
    }

    content {
        @apply p-8 z-10 rounded-[2rem];
        @apply bg-surface dark:bg-surface-dark shadow-elevation-4;
        @apply border border-solid border-stroke dark:border-stroke-dark;

        &.small {
            max-width: 360px;
        }
        &.medium {
            max-width: 480px;
        }
        &.large {
            max-width: 630px;
        }

        &.fit {
            max-width: fit-content;
        }
    }
</style>
