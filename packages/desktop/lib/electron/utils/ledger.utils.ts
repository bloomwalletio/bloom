import AppEth from '@ledgerhq/hw-app-eth'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { listen } from '@ledgerhq/logs'
import type { ILedgerEthereumAppSettings } from '@core/ledger/interfaces'

// import specifity for core modules to prevent circular dependencies
import { IEvmAddress, IEvmSignature } from '@core/layer-2/interfaces'
import { HEX_PREFIX } from '@core/utils/constants'

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
    return <ILedgerEthereumAppSettings>{
        version: settings.version,
        blindSigningEnabled: Boolean(settings.arbitraryDataEnabled),
        erc20ProvisioningNecessary: Boolean(settings.erc20ProvisioningNecessary),
        starkEnabled: Boolean(settings.starkEnabled),
        starkv2Supported: Boolean(settings.starkv2Supported),
    }
}

export async function getEvmAddress(bip32Path: string): Promise<IEvmAddress> {
    const appEth = new AppEth(transport)
    const data = await appEth.getAddress(bip32Path)

    return { evmAddress: data.address, bip32Path }
}

export async function signTransactionData(transactionHex: string, bip32Path: string): Promise<IEvmSignature> {
    try {
        const appEth = new AppEth(transport)
        const signature = await appEth.signTransaction(bip32Path, transactionHex, null)
        return {
            r: HEX_PREFIX + signature.r,
            v: HEX_PREFIX + signature.v,
            s: HEX_PREFIX + signature.s,
        }
    } catch (error) {
        return {
            r: '',
            v: '',
            s: '',
        }
    }
}

export async function signEIP712Message(
    hashedDomain: string,
    hashedMessage: string,
    bip32Path: string
): Promise<IEvmSignature> {
    try {
        const appEth = new AppEth(transport)
        const signature = await appEth.signEIP712HashedMessage(bip32Path, hashedDomain, hashedMessage)
        return {
            r: signature.r,
            s: signature.s,
            v: signature.v.toString(),
        }
    } catch (error) {
        return {
            r: undefined,
            s: undefined,
            v: undefined,
        }
    }
}

export async function signMessage(messageHex: string, bip32Path: string): Promise<IEvmSignature> {
    try {
        const appEth = new AppEth(transport)
        const signature = await appEth.signPersonalMessage(bip32Path, messageHex)
        return {
            r: signature.r,
            s: signature.s,
            v: signature.v.toString(),
        }
    } catch (error) {
        return {
            r: undefined,
            s: undefined,
            v: undefined,
        }
    }
}
