import { IIrc27Metadata } from '../interfaces'

export function isScamIrc27Nft(metadata: IIrc27Metadata): boolean {
    const SCAM_URLS = ['iotalottery.com', 'iota-lottery.com', 'lottery-iota.com', 'fly-fire.com']
    const SCAM_PHRASES = ['lottery', 'lotto', 'raffle', 'giveaway', 'scam', 'won']
    if (
        SCAM_URLS.some(
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
        SCAM_PHRASES.some(
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
