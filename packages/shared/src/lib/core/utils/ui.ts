import type { UiEventFunction } from './types'

import type { Action } from 'svelte/action'

export function pxToRem(px: number, base: number = 16): number {
    return px / base
}

/**
 * Debounce function to limit the rate at which a function can fire;
 * prevents repeated calls to callback until wait timeout finishes
 * @param callback The function to be debounced
 * @param wait The time in milliseconds to wait before calling the function
 * source: https://amitd.co/code/typescript/debounce
 */
export function debounce<T extends UiEventFunction>(callback: T, wait = 500): UiEventFunction {
    let timer: ReturnType<typeof setTimeout>
    return (...args: unknown[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => callback(...args), wait)
    }
}

/**
 * Dispatch event on click outside of node
 * source: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
 * source: https://github.com/vnphanquang/svelte-put/tree/main/packages/actions/clickoutside
 */
export const clickOutside: Action<HTMLElement> = function (node) {
    const onClick: (event: Event) => void = (event) => {
        if (!node) {
            return
        }

        const hasClickedInNavbar = document.querySelector('body > app > navbar')?.contains(event.target as Node)
        const hasClickedOutside = !node.contains(event.target as Node)
        if (hasClickedOutside && !hasClickedInNavbar && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('clickOutside', { detail: event }))
        }
    }

    document.addEventListener('mousedown', onClick, true)

    return {
        destroy(): void {
            document.removeEventListener('mousedown', onClick, true)
        },
    }
}

/**
 * Action function that can be used by Svelte
 * Dispatches slide events abstracted from touch events
 * @param node HTMLElement to attach events to
 */
export function slidable(node: HTMLElement, use: boolean = true): { destroy: () => void } {
    let x: number
    let y: number
    let init: number
    // Define arrays for calc velocity later
    const positionQueue = { x: [0, 0, 0], y: [0, 0, 0] }
    const timeQueue = [0, 0, 0]

    function handleTouchstart(event: TouchEvent): void {
        event.stopImmediatePropagation()
        event.stopPropagation()

        if (event.targetTouches.length === 1) {
            init = window.performance.now()
            x = event.touches[0].pageX
            y = event.touches[0].pageY
        }

        node.addEventListener('touchmove', handleTouchmove, { capture: true, passive: true })
        node.addEventListener('touchend', handleTouchend, { capture: true, passive: true })
    }

    function handleTouchmove(event: TouchEvent): void {
        positionQueue.x.push(event.touches[0].pageX)
        positionQueue.y.push(event.touches[0].pageY)
        timeQueue.push(window.performance.now())
        positionQueue.x.shift()
        positionQueue.y.shift()
        timeQueue.shift()
        const initX = positionQueue.x[0]
        const endX = positionQueue.x[positionQueue.x.length - 1]
        const initY = positionQueue.y[0]
        const endY = positionQueue.y[positionQueue.y.length - 1]
        const initTime = timeQueue[0]
        const endTime = timeQueue[timeQueue.length - 1]

        if (event.targetTouches.length === 1) {
            const sx = event.touches[0].pageX - x
            const sy = event.touches[0].pageY - y
            x = event.touches[0].pageX
            y = event.touches[0].pageY

            node.dispatchEvent(
                new CustomEvent('slideMove', {
                    detail: { x, y, sx, sy, initX, endX, initY, endY, initTime, endTime },
                })
            )
        }
    }

    function handleTouchend(): void {
        node.dispatchEvent(new CustomEvent('slideEnd'))

        const elapsed = window.performance.now()
        if (init >= elapsed - 300) {
            node.dispatchEvent(new CustomEvent('tap'))
        }

        node.removeEventListener('touchmove', handleTouchmove, { capture: true })
        node.removeEventListener('touchend', handleTouchend, { capture: true })
    }

    if (use) {
        node.addEventListener('touchstart', handleTouchstart, { capture: true, passive: true })
    }

    return {
        destroy(): void {
            node.removeEventListener('touchstart', handleTouchstart, { capture: true })
        },
    }
}
