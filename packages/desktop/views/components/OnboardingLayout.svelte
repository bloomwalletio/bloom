<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
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

    export let size: 'small' | 'medium' | 'large' = 'medium'
    export let title: string | undefined = undefined
    export let description: string | undefined = undefined
    export let continueButton: Partial<IButtonProps> | undefined = DEFAULT_CONTINUE_BUTTON
    export let backButton: Partial<IButtonProps> | undefined = DEFAULT_BACK_BUTTON
    export let busy: boolean = false

    $: _continueButton = { ...DEFAULT_CONTINUE_BUTTON, ...continueButton }
    $: _backButton = { ...DEFAULT_BACK_BUTTON, ...backButton }
</script>

<LoggedOutLayout>
    <div slot="header" class="header flex-none">
        <div class="flex h-full items-center">
            {#if !_backButton.hidden}
                <Button
                    variant="text"
                    icon={IconName.ArrowLeft}
                    disabled={busy || !_backButton.onClick || _backButton.disabled}
                    on:click={_backButton.onClick}
                    text={_backButton.text}
                />
            {/if}
        </div>
    </div>
    <content
        slot="content"
        class="{size} flex flex-col space-y-6 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-elevation-4"
    >
        <content-title class="h-full flex flex-col space-y-2.5">
            {#if title}<Text type="h5" textColor="brand">{title}</Text>{/if}
            {#if description}<Text type="body2" textColor="secondary">{description}</Text>{/if}
        </content-title>
        <slot name="content" />
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
    </content>
    <!-- Ghost footer to make above content centred-->
    <div slot="footer" class="flex-none h-20" />
</LoggedOutLayout>

<style lang="scss">
    .header {
        height: 42px;
    }

    content {
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
</style>
