<script lang="ts">
    import { IconButton, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { drawerState } from '@desktop/auxiliary/drawer'

    export let title: string = ''
    export let drawerRouter: Router<unknown>
    export let onBack: () => void = () => {}
    export let showBack: boolean | undefined = undefined

    $: showBackButton = showBack ?? drawerRouter?.hasHistory()

    function onBackClick(): void {
        if (drawerRouter) {
            onBack()
            drawerRouter.previous()
        }
    }
</script>

{#if $drawerState}
    <drawer-template class="flex flex-col h-full overflow-visible">
        <drawer-header class="flex flex-row items-center gap-2 p-6 mr-8">
            {#if showBackButton}
                <IconButton
                    icon={IconName.ArrowLeft}
                    size="sm"
                    on:click={onBackClick}
                    tooltip={localize('actions.back')}
                />
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
        {#if $$slots.footer}
            <drawer-footer class="w-full self-end overflow-visible p-6">
                <slot name="footer" />
            </drawer-footer>
        {/if}
    </drawer-template>
{/if}
