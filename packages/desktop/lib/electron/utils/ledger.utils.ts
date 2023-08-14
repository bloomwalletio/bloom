import AppEth from '@ledgerhq/hw-app-eth'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { listen } from '@ledgerhq/logs'

import type { IEvmTransactionSignature } from '@core/layer-2/interfaces'
import type { ILedgerEthereumAppSettings } from '@core/ledger/interfaces'

let transport: TransportNodeHid

export async function openTransport(): Promise<void> {
    if (!transport) {
        transport = await TransportNodeHid.open('')
        listen((log) => {
            process.parentPort.postMessage({ data: log })
        })
    }
}

export async function closeTransport(): Promise<void> {
    if (transport) {
        await transport.close()
        transport = undefined
    }
}

export async function getEthereumAppSettings(): Promise<ILedgerEthereumAppSettings> {
    const appEth = new AppEth(transport)
    const settings = await appEth.getAppConfiguration()
    return {
        version: settings.version,
        arbitraryDataEnabled: Boolean(settings.arbitraryDataEnabled),
        erc20ProvisioningNecessary: Boolean(settings.erc20ProvisioningNecessary),
        starkEnabled: Boolean(settings.starkEnabled),
        starkv2Supported: Boolean(settings.starkv2Supported),
    }
}

export async function getEvmAddress(bip32Path: string): Promise<{ evmAddress: string; bip32Path: string }> {
    const appEth = new AppEth(transport)
    const data = await appEth.getAddress(bip32Path)

    return { evmAddress: data.address, bip32Path }
}

export async function signTransactionData(
    transactionHex: string,
    bip32Path: string
): Promise<IEvmTransactionSignature> {
    try {
        const appEth = new AppEth(transport)
        const signature = await appEth.signTransaction(bip32Path, transactionHex, null)
        return {
            r: '0x' + signature.r,
            v: '0x' + signature.v,
            s: '0x' + signature.s,
        }
    } catch (error) {
        return {
            r: '',
            v: '',
            s: '',
        }
    }
}
