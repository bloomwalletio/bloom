<script lang="ts">
    import { formatNumber, parseCurrency } from '@core/i18n'

    export let decimals = 0
    export let disabled = false
    export let id: string | null = null
    export let max = 100
    export let min = 0
    export let value: string

    let container: HTMLElement
    let thumb: HTMLElement
    let progressBar: HTMLElement
    let element: HTMLElement

    let elementX: number
    let currentThumb: HTMLElement | null
    let holding = false
    let thumbHover = false

    // Mouse shield used onMouseDown to prevent any mouse events penetrating other elements,
    // ie. hover events on other elements while dragging. Especially for Safari
    const mouseEventShield = document.createElement('div')
    mouseEventShield.setAttribute('class', 'mouse-over-shield')
    mouseEventShield.addEventListener('mouseover', (event) => {
        event.preventDefault()
        event.stopPropagation()
    })

    function onWindowResize(): void {
        elementX = element.getBoundingClientRect().left
    }

    function setValue(val: number): void {
        value = formatNumber(val, undefined, decimals > 0 ? decimals : undefined, 0)
    }

    function onTrackEvent(event: TouchEvent | MouseEvent): void {
        if (disabled) {
            return
        }
        // Update value immediately before beginning drag
        updateValueOnEvent(event)
        onDragStart(event)
    }

    function onDragStart(event: TouchEvent | MouseEvent): void {
        if (disabled) {
            return
        }
        // If mouse event add a pointer events shield
        if (event.type === 'mousedown') {
            document.body.append(mouseEventShield)
        }
        currentThumb = thumb
    }

    function onDragEnd(event: TouchEvent | MouseEvent): void {
        if (disabled) {
            return
        }
        // If using mouse - remove pointer event shield
        if (event.type === 'mouseup') {
            if (document.body.contains(mouseEventShield)) document.body.removeChild(mouseEventShield)
            // Needed to check whether thumb and mouse overlap after shield removed
            if (isMouseInElement(event as MouseEvent, thumb)) thumbHover = true
        }
        currentThumb = null
    }

    // Check if mouse event cords overlay with an element's area
    function isMouseInElement(event: MouseEvent, element: HTMLElement): boolean {
        const rect = element.getBoundingClientRect()
        const { clientX: x, clientY: y } = event
        if (x < rect.left || x >= rect.right) {
            return false
        }
        if (y < rect.top || y >= rect.bottom) {
            return false
        }
        return true
    }

    function calculateNewValue(clientX: number): void {
        // Find distance between cursor and element's left cord (20px / 2 = 10px) - Center of thumb
        const delta = clientX - (elementX + 10)

        // Use width of the container minus (5px * 2 sides) offset for percent calc
        let percent = (delta * 100) / (container.clientWidth - 10)

        // Limit percent 0 -> 100
        percent = percent < 0 ? 0 : percent > 100 ? 100 : percent

        // Limit value min -> max
        const val = Math.floor((percent / 100) * (max - min) * 10 ** decimals) / 10 ** decimals + min
        setValue(val)
    }

    // Handles both dragging of touch/mouse as well as simple one-off click/touches
    function updateValueOnEvent(event: TouchEvent | MouseEvent): void {
        // touchstart && mousedown are one-off updates, otherwise expect a currentPointer node
        if (!currentThumb && event.type !== 'touchstart' && event.type !== 'mousedown') {
            return
        }

        event.stopPropagation && event.stopPropagation()
        event.preventDefault && event.preventDefault()

        // Get client's x cord either touch or mouse
        const clientX =
            event.type === 'touchmove' || event.type === 'touchstart'
                ? (event as TouchEvent).touches[0].clientX
                : (event as MouseEvent).clientX

        calculateNewValue(clientX)
    }

    // React to left position of element relative to window
    $: element && (elementX = element.getBoundingClientRect().left)

    // Set a class based on if dragging
    $: holding = Boolean(currentThumb)

    // Update progressbar and thumb styles to represent value
    $: if (progressBar && thumb) {
        let percent = ((parseCurrency(value) - min) * 100) / (max - min)
        percent = Math.max(Math.min(percent, 100), 0)
        const offsetLeft = (container.clientWidth - 10) * (percent / 100) + 5

        // Update thumb position + active range track width
        thumb.style.left = `${offsetLeft}px`
        progressBar.style.width = `${offsetLeft}px`
    }
</script>

<svelte:window
    on:touchmove|nonpassive={updateValueOnEvent}
    on:touchcancel={onDragEnd}
    on:touchend={onDragEnd}
    on:mousemove={updateValueOnEvent}
    on:mouseup={onDragEnd}
    on:resize={onWindowResize}
/>

<slider-input class:cursor-pointer={!disabled}>
    <range-wrapper
        tabindex="0"
        bind:this={element}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={parseCurrency(value)}
        {id}
        on:mousedown={onTrackEvent}
        on:touchstart={onTrackEvent}
    >
        <range-track bind:this={container}>
            <progress-bar bind:this={progressBar} class:disabled />
            <range-thumb
                class:disabled
                class:holding
                bind:this={thumb}
                on:touchstart={onDragStart}
                on:mousedown={onDragStart}
                on:mouseover={() => (thumbHover = true)}
                on:focus={() => (thumbHover = true)}
                on:mouseout={() => (thumbHover = false)}
                on:blur={() => (thumbHover = false)}
            />
        </range-track>
    </range-wrapper>
</slider-input>

<style lang="postcss">
    :global(.mouse-over-shield) {
        @apply fixed top-0 left-0 z-50;
        @apply h-full w-full;
        @apply bg-black opacity-0;
        cursor: grabbing;
    }

    slider-input {
        @apply block relative flex-1;
    }

    range-wrapper {
        @apply block relative outline-none;
        @apply box-border min-w-full p-2;

        &:focus-visible > .range__track {
            box-shadow:
                0 0 0 2px white,
                0 0 0 3px var(--track-focus, #874cdb);
        }
    }

    range-track {
        @apply block;
        @apply rounded-full h-1.5;
        background-color: var(--track-bgcolor, #d8e3f5);
    }

    progress-bar {
        @apply block absolute;
        @apply rounded-full w-0 h-1.5;

        &:not(.disabled) {
            @apply bg-primary;
        }

        &.disabled {
            @apply bg-neutral;
        }
    }

    range-thumb {
        @apply absolute flex items-center justify-center select-none;
        @apply rounded-full -mt-2 w-5 h-5;
        transition: box-shadow 100ms;
        box-shadow: var(--thumb-boxshadow, 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 0px 2px 1px rgba(0, 0, 0, 0.2));

        &:not(.disabled) {
            @apply bg-primary cursor-pointer;
        }

        &.disabled {
            @apply bg-neutral;
        }

        &.holding {
            box-shadow:
                0 1px 1px 0 rgba(0, 0, 0, 0.14),
                0 1px 2px 1px rgba(0, 0, 0, 0.2),
                0 0 0 6px var(--thumb-holding-outline, rgba(113, 119, 250, 0.3));
        }
    }
</style>
