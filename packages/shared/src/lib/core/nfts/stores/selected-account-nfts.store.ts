import { derived, Readable, Writable, writable } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'

import { IIrc27Nft, Nft } from '../interfaces'
import { allAccountNfts } from './all-account-nfts.store'
import { time } from '@core/app/stores/time.store'
import { NftStandard } from '@core/nfts'

export const selectedAccountNfts: Readable<Nft[]> = derived(
    [selectedAccount, allAccountNfts],
    ([$selectedAccount, $allAccountNfts]) => {
        if ($selectedAccount) {
            return $allAccountNfts[$selectedAccount.index] ?? []
        } else {
            return []
        }
    }
)

export const ownedNfts: Readable<Nft[]> = derived([selectedAccountNfts, time], ([$selectedAccountNfts, $time]) =>
    $selectedAccountNfts.filter((nft) => {
        switch (nft.standard) {
            case NftStandard.Erc721:
            case NftStandard.Irc27: {
                const { isSpendable, timelockTime } = nft as IIrc27Nft
                return isSpendable || timelockTime > $time.getTime()
            }
            default:
                return false
        }
    })
)

export const nftSearchTerm: Writable<string> = writable('')

export const queriedNfts: Readable<Nft[]> = derived([ownedNfts, nftSearchTerm], ([$ownedNfts, $nftSearchTerm]) => {
    let nftList = $ownedNfts

    if ($nftSearchTerm) {
        nftList = nftList.filter((nft) => nft.name.toLowerCase().includes($nftSearchTerm.toLowerCase()))
    }

    return nftList.sort((nft1, nft2) => (nft2.name.toLowerCase() < nft1.name.toLowerCase() ? 1 : -1))
})
