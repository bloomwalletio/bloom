import { Core } from '@walletconnect/core'

export const WALLET_CONNECT_CORE = new Core({
    projectId: process.env.WALLETCONNECT_PROJECT_ID,
})
