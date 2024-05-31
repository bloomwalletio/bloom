import { Writable, writable } from 'svelte/store'
import { Web3WalletTypes } from '@walletconnect/web3wallet'

export type ConnectionRequest =
    | {
          type: 'session_proposal'
          payload: Web3WalletTypes.SessionProposal
      }
    | {
          type: 'session_authenticate'
          payload: Web3WalletTypes.SessionAuthenticate
      }

export const connectionRequest: Writable<ConnectionRequest | undefined> = writable(undefined)

export function clearConnectionRequest(): void {
    connectionRequest.set(undefined)
}
