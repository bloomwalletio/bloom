import { derived, Readable, Writable, writable } from 'svelte/store'
import { selectedAccount } from '@core/account/stores'
import { IIrc27Nft, Nft } from '../interfaces'
import { activeProfileNftsPerAccount } from './active-profile-nfts-per-account'
import { time } from '@core/app/stores/time.store'
import { NftStandard } from '@core/nfts'

export const selectedAccountNfts: Readable<Nft[]> = derived(
    [selectedAccount, activeProfileNftsPerAccount],
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
                return isSpendable || (timelockTime && timelockTime > $time.getTime())
            }
            default:
                return false
        }
    })
)

export const nftSearchTerm: Writable<string> = writable('')
