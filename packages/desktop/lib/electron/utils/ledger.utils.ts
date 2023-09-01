import { IEvmTransactionSignature } from '@core/layer-2/interfaces'
import { HEXADECIMAL_PREFIX } from '@core/utils'
import AppEth from '@ledgerhq/hw-app-eth'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { listen } from '@ledgerhq/logs'

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
            r: HEXADECIMAL_PREFIX + signature.r,
            v: HEXADECIMAL_PREFIX + signature.v,
            s: HEXADECIMAL_PREFIX + signature.s,
        }
    } catch (error) {
        return {
            r: '',
            v: '',
            s: '',
        }
    }
}
