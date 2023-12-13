import { disconnectDapp } from '../actions'
import { getConnectedDapps } from '../stores'

export async function disconnectAllDapps(): Promise<void> {
    const dapps = getConnectedDapps()
    const disconnectPromises = dapps.map((dapp) => disconnectDapp(dapp))
    await Promise.all(disconnectPromises)
}
