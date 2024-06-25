import { Writable, writable } from 'svelte/store'
import { Web3WalletTypes } from '@walletconnect/web3wallet'

export const sessionInitiationRequest: Writable<Web3WalletTypes.SessionProposal | undefined> = writable(undefined)

export function clearSessionInitiationRequest(): void {
    sessionInitiationRequest.set(undefined)
}
