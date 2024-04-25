import { appParameters } from '@core/app/stores'
import { IIrc27Metadata } from '../interfaces'
import { get } from 'svelte/store'

export function isScamIrc27Nft(metadata: IIrc27Metadata): boolean {
    const { urls, keywords } = get(appParameters).denylists

    if (
        urls.some(
            (url) =>
                metadata?.uri?.toLocaleLowerCase()?.includes(url) ||
                metadata?.name?.toLocaleLowerCase()?.includes(url) ||
                metadata?.description?.toLocaleLowerCase().includes(url) ||
                metadata?.collectionName?.toLocaleLowerCase().includes(url) ||
                metadata?.issuerName?.toLocaleLowerCase()?.includes(url)
        )
    ) {
        return true
    } else if (
        keywords.some(
            (phrase) =>
                metadata?.name?.toLocaleLowerCase()?.includes(phrase) ||
                metadata?.issuerName?.toLocaleLowerCase()?.includes(phrase) ||
                metadata?.collectionName?.toLocaleLowerCase()?.includes(phrase) ||
                metadata?.description?.toLocaleLowerCase()?.includes(phrase)
        )
    ) {
        return true
    } else {
        return false
    }
}
