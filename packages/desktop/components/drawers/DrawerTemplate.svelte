<script lang="ts">
    import { IconButton, IconName, Text } from '@bloomwalletio/ui'
    import { Router } from '@core/router'

    export let title: string = ''
    export let drawerRouter: Router<unknown>

    $: showBackButton = drawerRouter?.hasHistory()

    function onBackClick(): void {
        if (drawerRouter) {
            drawerRouter.previous()
        }
    }
</script>

<drawer-template class="flex flex-col h-full overflow-visible">
    <drawer-header class="flex flex-row items-center gap-2 p-6 mr-8">
        {#if showBackButton}
            <IconButton icon={IconName.ArrowLeft} size="sm" on:click={onBackClick} />
        {/if}

        {#if $$slots.header}
            <slot name="header" />
        {:else}
            <Text type="h6">
                {title}
            </Text>
        {/if}
    </drawer-header>
    <drawer-body class="flex-grow overflow-auto">
        <slot />
    </drawer-body>
    <drawer-footer class="w-full self-end overflow-visible p-6">
        <slot name="footer" />
    </drawer-footer>
</drawer-template>
