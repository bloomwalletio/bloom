<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let size: 'small' | 'medium' | 'large' = 'medium'
    export let title: string
    export let description: string | undefined = undefined
    export let busy = false
    export let disableBack = false
    export let onBackClick: (() => unknown) | undefined = undefined
    export let onContinueClick: (() => unknown) | undefined = undefined
</script>

<onboarding-layout class="w-full h-screen flex justify-center items-center">
    {#if onBackClick && !disableBack}
        <back-container>
            <Button
                variant="text"
                size="md"
                icon={IconName.ArrowLeft}
                disabled={busy}
                on:click={onBackClick}
                text={localize('actions.back')}
            />
        </back-container>
    {/if}
    <content-container
        class="{size} flex flex-col space-y-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-elevation-4"
    >
        <content-title class="h-full flex flex-col space-y-2">
            <Text type="h4" color="purple-500">{title}</Text>
            {#if description}<Text color="gray-500">{description}</Text>{/if}
        </content-title>
        <slot name="content" />
        <content-buttons class="block flex flex-row space-x-2">
            {#if onBackClick && !disableBack}
                <Button
                    width="full"
                    variant="outline"
                    size="md"
                    disabled={busy}
                    on:click={onBackClick}
                    text={localize('actions.back')}
                />
            {/if}
            {#if onContinueClick}
                <Button
                    width="full"
                    variant="contained"
                    size="md"
                    disabled={busy}
                    on:click={onContinueClick}
                    text={localize('actions.continue')}
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
