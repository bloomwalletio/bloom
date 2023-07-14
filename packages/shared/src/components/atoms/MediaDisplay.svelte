<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { onMount } from 'svelte'

    export let Media: HTMLImageElement | HTMLVideoElement | undefined = undefined
    export let src: string
    export let expectedType: MimeType
    export let alt: string = ''
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false
    export let classes: string = ''
    export let isLoaded: boolean

    let isMounted = false

    $: parentMimeType = getParentMimeType(expectedType)
    $: isLoaded && muteVideo()

    function muteVideo() {
        if (muted && Media instanceof HTMLVideoElement) {
            Media.muted = true
        }
    }

    function startPlaying() {
        if (!autoplay && Media instanceof HTMLVideoElement) {
            Media.play()
        }
    }

    function stopPlaying() {
        if (!autoplay && Media instanceof HTMLVideoElement) {
            Media.pause()
        }
    }

    function getParentMimeType(mimeType: MimeType): string | undefined {
        return mimeType?.split('/', 1)?.[0]
    }

    onMount(() => {
        isMounted = true
    })
</script>

{#if isMounted}
    {#key isLoaded && src}
        {#if parentMimeType === ParentMimeType.Image}
            <img {src} {alt} class={classes} />
        {:else if parentMimeType === ParentMimeType.Video}
            <video
                bind:this={Media}
                {src}
                class={classes}
                autoplay={autoplay ? true : undefined}
                controls={controls ? true : undefined}
                loop={loop ? true : undefined}
                muted
                preload="metadata"
                on:mouseenter={startPlaying}
                on:mouseleave={stopPlaying}
            />
        {/if}
    {/key}
{/if}
