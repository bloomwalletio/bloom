<script lang="ts">
    import { Avatar, IconName, Tooltip } from '@bloomwalletio/ui'
    import { darkMode } from '@core/app/stores'
    import type { NotifyClientTypes } from '@walletconnect/notify-client'

    export let subscription: NotifyClientTypes.NotifySubscription | undefined = undefined
    export let notificationType: string | undefined = undefined

    let dappImageError = false
    let notificationImageError = false
    $: hasDappImage = subscription?.metadata.icons[0] && !dappImageError

    let dappAnchor: HTMLElement
    let notificationAnchor: HTMLElement
</script>

<div class="relative self-start" bind:this={dappAnchor}>
    <Avatar
        size="lg"
        icon={!hasDappImage ? IconName.Application : undefined}
        textColor="primary"
        backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
    >
        {#if hasDappImage}
            <img
                src={subscription?.metadata.icons[0]}
                alt={subscription?.metadata?.name}
                class="size-full"
                on:error={() => (dappImageError = true)}
            />
        {/if}
    </Avatar>
    {#if notificationType && subscription?.scope[notificationType]}
        <span class="absolute -right-1 -bottom-1" bind:this={notificationAnchor}>
            <Avatar
                size="xs"
                icon={notificationImageError ? IconName.Bell : undefined}
                textColor="primary"
                backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
            >
                {#if !notificationImageError}
                    <img
                        src={subscription.scope[notificationType]?.imageUrls.sm}
                        alt={notificationType}
                        class="size-full"
                        on:error={() => (notificationImageError = true)}
                    />
                {/if}
            </Avatar>
        </span>
    {/if}
</div>
{#if subscription?.metadata.name}
    <Tooltip anchor={dappAnchor} text={subscription.metadata.name} placement="right" event="hover" />
{/if}
{#if notificationType && subscription?.scope[notificationType].name}
    <Tooltip
        anchor={notificationAnchor}
        text={subscription.scope[notificationType].name}
        placement="right"
        event="hover"
    />
{/if}
