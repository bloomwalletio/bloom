<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Platform } from '@core/app'
    import { OS } from '@core/app/constants'
    import { Icon } from '@ui'
    import { onDestroy, onMount } from 'svelte'

    let isMaximized = false

    async function onResize(): Promise<void> {
        isMaximized = await Platform.isMaximized()
    }

    onMount(async () => {
        await onResize()
        document.body.classList.add(`platform-${OS}`)
        /* eslint-disable @typescript-eslint/no-misused-promises */
        window.addEventListener('resize', onResize)
    })

    onDestroy(() => {
        /* eslint-disable @typescript-eslint/no-misused-promises */
        window.removeEventListener('resize', onResize)
    })
</script>

<window-control-buttons class="flex flex-row justify-end space-x-4 mr-4">
    <button on:click={Platform.minimize} class="text-gray-500 dark:text-gray-100" type="button">
        <Icon icon={IconEnum.Minimize} />
    </button>
    <button
        on:click={async () => (isMaximized = await Platform.maximize())}
        class="text-gray-500 dark:text-gray-100"
        type="button"
    >
        {#if isMaximized}
            <Icon icon={IconEnum.RestoreSize} />
        {:else}
            <Icon icon={IconEnum.Maximize} />
        {/if}
    </button>
    <button on:click={Platform.close} class="text-gray-500 dark:text-gray-100" type="button">
        <Icon icon={IconEnum.CloseThin} />
    </button>
</window-control-buttons>
