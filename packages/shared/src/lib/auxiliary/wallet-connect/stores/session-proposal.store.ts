import { Writable, get, writable } from 'svelte/store'
import { Web3WalletTypes } from '@walletconnect/web3wallet'

export const sessionProposal: Writable<Web3WalletTypes.SessionProposal | undefined> = writable(undefined)

export function getSessionProposal(): Web3WalletTypes.SessionProposal | undefined {
    return get(sessionProposal)
}
