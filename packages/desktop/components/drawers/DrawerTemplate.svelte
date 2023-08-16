<script lang="ts">
    import { Icon, Text, TextType } from '@ui'
    import { Router } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let title: string
    export let drawerRouter: Router<unknown>

    $: showBackButton = drawerRouter?.hasHistory()

    function onBackClick(): void {
        if (drawerRouter) {
            drawerRouter.previous()
        }
    }
</script>

<drawer-template class="flex flex-col h-full space-y-6 overflow-visible">
    <drawer-header class="flex flex-row items-center gap-2 mr-8">
        {#if showBackButton}
            <button on:click={onBackClick} class=" focus:text-blue-500">
                <Icon
                    icon={IconEnum.ArrowLeft}
                    classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
                />
            </button>
        {/if}

        {#if $$slots.header}
            <slot name="header" />
        {:else}
            <Text type={TextType.h4} classes="text-center">
                {title}
            </Text>
        {/if}
    </drawer-header>
    <drawer-body class="flex-grow overflow-auto">
        <slot />
    </drawer-body>
    <drawer-footer class="w-full self-end overflow-visible">
        <slot name="footer" />
    </drawer-footer>
</drawer-template>
