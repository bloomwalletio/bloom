import { api } from '../api'

export async function verifyMnemonic(mnemonic: string): Promise<void> {
    await api.verifyMnemonic(mnemonic)
}
