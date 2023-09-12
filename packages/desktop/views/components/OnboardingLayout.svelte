<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
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

    export let size: 'small' | 'medium' | 'large' = 'medium'
    export let title: string | undefined = undefined
    export let description: string | undefined = undefined
    export let continueButton: Partial<IButtonProps> | undefined = DEFAULT_CONTINUE_BUTTON
    export let backButton: Partial<IButtonProps> | undefined = DEFAULT_BACK_BUTTON
    export let busy: boolean = false

    $: _continueButton = { ...DEFAULT_CONTINUE_BUTTON, ...continueButton }
    $: _backButton = { ...DEFAULT_BACK_BUTTON, ...backButton }
</script>

<onboarding-layout class="w-full h-screen flex justify-center items-center">
    {#if !_backButton.hidden}
        <back-container>
            <Button
                variant="text"
                size="md"
                icon={IconName.ArrowLeft}
                disabled={busy || !_backButton.onClick || _backButton.disabled}
                on:click={_backButton.onClick}
                text={_backButton.text}
            />
        </back-container>
    {/if}
    <content-container
        class="{size} flex flex-col space-y-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-elevation-4"
    >
        <content-title class="h-full flex flex-col space-y-2">
            {#if title}<Text type="h4" color="purple-500">{title}</Text>{/if}
            {#if description}<Text color="gray-500">{description}</Text>{/if}
        </content-title>
        <slot name="content" />
        <content-buttons class="block flex flex-row space-x-2">
            {#if !_backButton.hidden}
                <Button
                    width="full"
                    variant="outline"
                    size="md"
                    disabled={busy || _backButton.disabled || !_backButton.onClick}
                    on:click={_backButton.onClick}
                    text={_backButton.text}
                />
            {/if}
            {#if !_continueButton.hidden}
                <Button
                    width="full"
                    variant="contained"
                    size="md"
                    disabled={_continueButton.disabled || !_continueButton.onClick}
                    {busy}
                    on:click={_continueButton.onClick}
                    text={_continueButton.text}
                />
            {/if}
        </content-buttons>
    </content-container>
</onboarding-layout>

<style lang="scss">
    back-container {
        position: absolute;
        top: 0px;
        left: 32px;
        margin-top: 64px;
    }
    content-container {
        width: 100%;
        &.small {
            max-width: 360px;
        }
        &.medium {
            max-width: 480px;
        }
        &.large {
            max-width: 630px;
        }
    }

    icon-container {
        @apply block cursor-pointer text-blue-500;

        &.busy {
            @apply cursor-default pointer-events-none text-gray-500;
        }
    }
</style>
