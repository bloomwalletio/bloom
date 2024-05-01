import { appParameters } from '@core/app/stores'
import { IErc721TokenMetadata } from '../interfaces'
import { get } from 'svelte/store'

export function isScamErc721Nft(metadata: IErc721TokenMetadata): boolean {
    const { urls, keywords } = get(appParameters).denylists

    if (
        urls.some(
            (url) =>
                metadata?.name?.toLocaleLowerCase()?.includes(url) ||
                metadata?.description?.toLocaleLowerCase()?.includes(url) ||
                metadata?.image?.toLocaleLowerCase()?.includes(url)
        )
    ) {
        return true
    } else if (
        keywords.some(
            (phrase) =>
                metadata?.name?.toLocaleLowerCase()?.includes(phrase) ||
                metadata?.description?.toLocaleLowerCase()?.includes(phrase)
        )
    ) {
        return true
    } else {
        return false
    }
}
