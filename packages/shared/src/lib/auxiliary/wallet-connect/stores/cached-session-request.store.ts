import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { Writable, writable } from 'svelte/store'

export const cachedSessionRequest: Writable<Web3WalletTypes.SessionRequest | undefined> = writable(undefined)
