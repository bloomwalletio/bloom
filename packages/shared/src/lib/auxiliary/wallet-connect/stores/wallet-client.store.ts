import { Web3Wallet } from '@walletconnect/web3wallet/dist/types/client'
import { Writable, get, writable } from 'svelte/store'

export const walletClient: Writable<Web3Wallet | undefined> = writable(undefined)

export function getWalletClient(): Web3Wallet | undefined {
    return get(walletClient)
}
