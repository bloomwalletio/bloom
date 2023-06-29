import { ipcRenderer } from 'electron'

export default {
    generateEvmAddress: (bip32Path: string, verify: boolean = false): void => {
        ipcRenderer.send('generate-evm-address', bip32Path, verify)
    },
    signEvmTransaction: (data: unknown, bip32Path: string): void => {
        ipcRenderer.send('sign-evm-transaction', data, bip32Path)
    },
}
