import { writable } from 'svelte/store'

export const countryCode = writable<string | undefined>(undefined)

export function updateCountryCode(_countryCode: string | undefined): void {
    if (countryCode) {
        countryCode.set(_countryCode)
    }
}
