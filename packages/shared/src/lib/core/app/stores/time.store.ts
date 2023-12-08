import { get, readable, Readable } from 'svelte/store'

export const time: Readable<Date> = readable(new Date(), (set) => {
    const interval = setInterval(() => {
        set(new Date())
    }, 1000)

    return (): void => clearInterval(interval)
})

export function getTime(): number {
    return get(time).getTime()
}
