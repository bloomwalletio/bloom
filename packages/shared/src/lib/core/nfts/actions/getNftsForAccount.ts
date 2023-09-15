import { get } from 'svelte/store'
import { INft } from '../interfaces'
import { allAccountNfts } from '../stores'

export function getNftsForAccount(accountIndex: number): INft[] {
    return get(allAccountNfts)[accountIndex] ?? []
}
