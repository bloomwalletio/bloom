<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let extentionsLabel = ''
    export let allowedExtensions: string[]
    export let dropping = false
    export let fileName = ''

    export let onDrop: (event?: Event) => void

    function onEnter(): void {
        dropping = true
    }

    function onLeave(): void {
        dropping = false
    }
</script>

<dropzone
    on:drop={onDrop}
    on:dragenter={onEnter}
    on:dragleave={onLeave}
    on:dragover|preventDefault
    class="flex flex-col items-center relative text-center gap-4"
>
    {#if dropping}
        <Text fontWeight="medium" textColor="secondary">{localize('actions.dropHere')}</Text>
    {:else if fileName}
        <Text fontWeight="medium" textColor="secondary">{fileName}</Text>
    {:else}
        <Icon name={IconName.Download} textColor="brand" size="lg" />
        <input
            class="absolute opacity-0 w-full h-full"
            class:dropping
            type="file"
            on:change={onDrop}
            accept={allowedExtensions ? allowedExtensions.map((e) => `.${e}`).join(',') : '*'}
        />
        <div>
            <Text type="body2">{localize('actions.dropOrBrowse')}</Text>
            <Text fontWeight="medium" textColor="secondary">{extentionsLabel}</Text>
        </div>
    {/if}
</dropzone>

<style lang="scss">
    dropzone {
        @apply flex items-center justify-center p-7 w-full transition-colors min-h-[198px];
        @apply bg-surface-1 dark:bg-surface-1-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark focus:bg-surface-2 dark:focus:bg-surface-2-dark;
        @apply rounded-lg border border-solid border-stroke dark:border-stroke-dark;

        .dropping {
            @apply pointer-events-none;
        }

        * {
            @apply cursor-pointer;
        }
    }
</style>
