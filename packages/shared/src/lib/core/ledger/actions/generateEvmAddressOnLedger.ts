import { buildBip32Path } from '@core/account/utils'
import { Ledger } from '@core/ledger/classes'
import { callLedgerFunctionAsync } from './callLedgerFunctionAsync'

export async function generateEvmAddressOnLedger(accountIndex: number, coinType: number): Promise<string> {
    const bip32Path = buildBip32Path(coinType, accountIndex)
    const response = await callLedgerFunctionAsync<{ evmAddress: string }>(
        () => Ledger.generateEvmAddress(bip32Path, false),
        'evm-address'
    )
    return response.evmAddress
}
