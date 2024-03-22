import { IAccount } from '@core/account'

export async function getDepositAddress(account: IAccount): Promise<string> {
    const addresses = await account.addresses()
    const { address } = addresses.find((address) => address.internal === false && address.keyIndex === 0) ?? {}
    if (!address) {
        throw new Error('Deposit address not available on account')
    }
    return address
}
