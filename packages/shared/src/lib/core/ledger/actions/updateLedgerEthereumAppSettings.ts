import { Ledger } from '../classes'
import { setLedgerEthereumAppSettings } from '../stores'

export async function updateLedgerEthereumAppSettings(): Promise<void> {
    const settings = await Ledger.getEthereumAppSettings()
    setLedgerEthereumAppSettings(settings)
}
