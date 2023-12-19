<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { onMount } from 'svelte'

    export let src: string
    export let expectedType: MimeType
    export let alt: string = ''
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false
    export let classes: string = ''
    export let isLoaded: boolean

    const parentMimeType = getParentMimeType(expectedType)
    let videoElement: HTMLVideoElement | undefined = undefined
    let playPromise: Promise<void> | undefined = undefined

    $: isLoaded && muteVideo()

    function muteVideo() {
        if (videoElement && muted) {
            videoElement.muted = true
        }
    }

    function startPlaying() {
        if (videoElement && !autoplay && videoElement.paused) {
            playPromise = videoElement.play()
            playPromise.then(() => {}).catch(console.error)
        }
    }

    function stopPlaying() {
        if (videoElement && !autoplay && !videoElement.paused) {
            playPromise
                ?.then(() => {
                    videoElement?.pause()
                })
                .catch(() => {}) ?? videoElement.pause()
        }
    }

    function getParentMimeType(mimeType: MimeType): string | undefined {
        return mimeType?.split('/', 1)?.[0]
    }

    let isMounted = false
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
                bind:this={videoElement}
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
