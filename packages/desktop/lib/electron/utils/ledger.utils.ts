import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { Transaction } from '@ethereumjs/tx'
import { bufArrToArr } from '@ethereumjs/util'

import AppEth from '@ledgerhq/hw-app-eth'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { listen } from '@ledgerhq/logs'

let transport: TransportNodeHid

const TX_OPTIONS = {
    common: Common.custom({
        chainId: 1072,
    }),
}

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
): Promise<{ signedTransaction: string }> {
    try {
        const appEth = new AppEth(transport)
        const signature = await appEth.signTransaction(bip32Path, transactionHex, null)
        const signedTransactionObject = Transaction.fromTxData(
            {
                ...data,
                v: '0x' + signature.v,
                r: '0x' + signature.r,
                s: '0x' + signature.s,
            },
            TX_OPTIONS
        )

        const serializedSignedTransaction = Buffer.from(RLP.encode(bufArrToArr(signedTransactionObject.raw())))
        const serializedSignedTransactionString = '0x' + serializedSignedTransaction.toString('hex')

        return { signedTransaction: serializedSignedTransactionString }
    } catch (error) {
        return { signedTransaction: undefined }
    }
}
