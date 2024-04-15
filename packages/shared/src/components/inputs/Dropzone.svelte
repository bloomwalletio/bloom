<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let extentionsLabel = ''
    export let allowedExtensions: string[]
    export let dropping = false
    export let fileName = ''

    export let onDrop: (event?: Event) => void

    let leaveTimeout: number | null = null

    function onEnter(): void {
        if (leaveTimeout !== null) {
            clearTimeout(leaveTimeout)
            leaveTimeout = null
        }
        dropping = true
    }

    function onLeave(): void {
        leaveTimeout = setTimeout(() => {
            dropping = false
        }, 50)
    }

    function onOver(event: DragEvent): void {
        if (leaveTimeout !== null) {
            clearTimeout(leaveTimeout)
            leaveTimeout = null
        }
        event.preventDefault() // prevent default is needed here to allow drops
    }
</script>

<dropzone
    on:drop={onDrop}
    on:dragenter={onEnter}
    on:dragleave={onLeave}
    on:dragover={onOver}
    class:dropping
    role="button"
    tabindex="0"
>
    <input
        class="absolute opacity-0 w-full h-full"
        type="file"
        on:change={onDrop}
        accept={allowedExtensions ? allowedExtensions.map((e) => `.${e}`).join(',') : '*'}
    />
    {#if fileName}
        <Text fontWeight="medium" textColor="secondary">{fileName}</Text>
    {:else}
        <Icon name={IconName.Download} textColor="brand" size="lg" />
        <div>
            <Text type="body2">{localize('actions.dropOrBrowse')}</Text>
            <Text fontWeight="medium" textColor="secondary">{extentionsLabel}</Text>
        </div>
    {/if}
</dropzone>

<style lang="postcss">
    dropzone {
        @apply relative flex flex-col items-center justify-center text-center;
        @apply gap-4 p-7 w-full transition-colors select-none min-h-[198px];
        @apply bg-surface-1 dark:bg-surface-1-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark focus:bg-surface-2 dark:focus:bg-surface-2-dark;
        @apply rounded-lg border border-solid border-stroke dark:border-stroke-dark;

        &.dropping {
            @apply border-2 border-dashed border-text-brand dark:border-text-brand-dark;

            input {
                @apply pointer-events-none;
            }
        }

        * {
            @apply cursor-pointer;
        }
    }
</style>
