import { getConnectedDapps, getWalletClient, setConnectedDapps } from '../stores'
import { removeDapp } from './removeDapp'
import { handleError } from '@core/error/handlers'

export async function clearOldPairings(dappOrigin: string): Promise<void> {
    const client = getWalletClient()
    if (!client) {
        return
    }

    try {
        const duplicatedDapp = getConnectedDapps().filter((dapp) => dapp.metadata?.url === dappOrigin)
        for (const dapp of duplicatedDapp) {
            await removeDapp(dapp)
        }
        setConnectedDapps()
    } catch (err) {
        handleError(err)
    }
}
