import { derived, writable, Readable } from 'svelte/store'

export const windowSize = writable({
    width: 0,
    height: 0,
})

export const breakpoint: Readable<'sm' | 'md' | 'lg' | 'xl' | '2xl'> = derived([windowSize], ([$windowSize]) => {
    if ($windowSize.width < 768) {
        return 'sm'
    } else if ($windowSize.width < 1024) {
        return 'md'
    } else if ($windowSize.width < 1280) {
        return 'lg'
    } else if ($windowSize.width < 1536) {
        return 'xl'
    } else if ($windowSize.width < 1792) {
        return '2xl'
    }

    return '2xl'
})
