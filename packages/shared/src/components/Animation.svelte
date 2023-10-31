<script lang="ts">
    import lottie, { AnimationItem, AnimationSegment } from 'lottie-web'
    import { appSettings } from '@core/app/stores'
    import { onDestroy } from 'svelte'

    export let animation: string | undefined = undefined
    export let classes = ''
    export let loop = true
    export let autoplay = true
    export let segments: AnimationSegment | AnimationSegment[] | undefined = undefined
    export let renderer: 'svg' | 'canvas' | 'html' = 'svg'

    const animations: { [key: string]: { lightmode: string; darkmode: string } } = {
        'loading-desktop': {
            lightmode: 'loading-desktop.json',
            darkmode: 'loading-desktop.json',
        },
        'ledger-disconnected-desktop': {
            lightmode: 'ledger/ledger-disconnected-desktop.json',
            darkmode: 'ledger/ledger-disconnected-desktop.json',
        },
        confetti: {
            lightmode: 'confetti.json',
            darkmode: 'confetti.json',
        },
    }

    let container: HTMLElement
    let lottieAnimation: AnimationItem

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = animation ? animations[animation]?.[darkModeEnabled ? 'darkmode' : 'lightmode'] : null

    $: if (selected && container) {
        const options = {
            container,
            renderer,
            path: `assets/animations/${selected}`,
            loop,
            autoplay,
        }
        destroyAnimation()
        lottieAnimation = lottie.loadAnimation(options)
    }

    $: if (lottieAnimation && segments) {
        lottieAnimation.removeEventListener('DOMLoaded', handleSegments)
        lottieAnimation.addEventListener('DOMLoaded', handleSegments)
    }

    function handleSegments(): void {
        if (segments) {
            lottieAnimation.playSegments(segments, true)
        }
    }

    function destroyAnimation(): void {
        if (lottieAnimation) {
            try {
                lottieAnimation.destroy()
            } catch (e) {
                console.error(e)
            }
        }
    }
    onDestroy(() => {
        if (lottieAnimation) {
            lottieAnimation.removeEventListener('DOMLoaded', handleSegments)
            destroyAnimation()
        }
    })
</script>

<animation class="w-full {classes}" bind:this={container} />
