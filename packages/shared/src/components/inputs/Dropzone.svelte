<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
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

<dropzone on:drop={onDrop} on:dragenter={onEnter} on:dragleave={onLeave} on:dragover|preventDefault>
    <content class:dropping class="flex flex-col items-center relative text-center">
        {#if dropping}
            <Text fontWeight="medium" textColor="secondary">{localize('actions.dropHere')}</Text>
        {:else if fileName}
            <Text fontWeight="medium" textColor="secondary">{fileName}</Text>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none">
                <path
                    d="M20 40.502L30 30.502M30 30.502L40 40.502M30 30.502V53.002M50 42.359C53.0538 39.8371 55 36.0218 55 31.752C55 24.158 48.8439 18.002 41.25 18.002C40.7037 18.002 40.1926 17.7169 39.9153 17.2463C36.6551 11.714 30.6361 8.00195 23.75 8.00195C13.3947 8.00195 5 16.3966 5 26.752C5 31.9172 7.08862 36.5946 10.4674 39.9858"
                    stroke="#7C41C9"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            <input
                class="absolute opacity-0 w-full h-full"
                type="file"
                on:change={onDrop}
                accept={allowedExtensions ? allowedExtensions.map((e) => `.${e}`).join(',') : '*'}
            />
            <div class="mt-2 mb-6">
                <Text type="body2">{localize('actions.dragDrop')}</Text>
                <Text fontWeight="medium" textColor="secondary">{extentionsLabel}</Text>
            </div>
            <Button size="sm" icon={IconName.Send} reverse on:click={onDrop} text={localize('actions.chooseFile')} />
        {/if}
    </content>
</dropzone>

<style lang="scss">
    dropzone {
        @apply flex items-center justify-center p-7 w-full h-[233px];
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply rounded-lg border border-solid border-stroke dark:border-stroke-dark;

        content {
            &.dropping {
                @apply pointer-events-none;
            }
            * {
                @apply cursor-pointer;
            }
        }
    }
</style>
