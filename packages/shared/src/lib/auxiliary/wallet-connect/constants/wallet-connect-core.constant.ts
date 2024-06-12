import { Core } from '@walletconnect/core'

export const WALLET_CONNECT_CORE = new Core({
    projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
})
