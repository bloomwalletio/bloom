import { Writable, writable } from 'svelte/store'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { SessionInitiationType } from '../enums'

export type SessionInitiationRequest =
    | {
          type: SessionInitiationType.SessionProposal
          payload: Web3WalletTypes.SessionProposal
      }
    | {
          type: SessionInitiationType.SessionAuthenticate
          payload: Web3WalletTypes.SessionAuthenticate
      }

export const sessionInitiationRequest: Writable<SessionInitiationRequest | undefined> = writable(undefined)

export function clearSessionInitiationRequest(): void {
    sessionInitiationRequest.set(undefined)
}
