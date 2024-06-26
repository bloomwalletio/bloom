import { Writable, writable } from 'svelte/store'
import { Web3WalletTypes } from '@walletconnect/web3wallet'

export type SessionInitiationRequest =
    | {
          type: 'session_proposal'
          payload: Web3WalletTypes.SessionProposal
      }
    | {
          type: 'session_authenticate'
          payload: Web3WalletTypes.SessionAuthenticate
      }

export const sessionInitiationRequest: Writable<SessionInitiationRequest | undefined> = writable(undefined)

export function clearSessionInitiationRequest(): void {
    sessionInitiationRequest.set(undefined)
}
