import { isIscpChain } from '@core/network'
import { getActiveProfile } from '@core/profile/stores'
import BigInteger from 'big-integer'

export class Wasp {
    static async getEstimatedGasForTransfer(serializedOutputHex: string): Promise<any> {
        const profile = getActiveProfile()
        const chainConfiguration = profile.network?.chainConfigurations?.[0] ?? null

        if (chainConfiguration && isIscpChain(chainConfiguration)) {
            const URL = `${chainConfiguration.iscpEndpoint}v1/chains/${chainConfiguration.aliasAddress}/estimategas-onledger`
            const body = JSON.stringify({ outputBytes: serializedOutputHex })

            const requestInit: RequestInit = {
                method: 'POST',
                body,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }

            const response = await fetch(URL, requestInit)
            if (response.status === 200) {
                const data = await response.json()
                const gasBurned = BigInteger(data.gasBurned as string).toJSNumber()
                const gasFeeCharged = BigInteger(data.gasFeeCharged as string).toJSNumber()

                return { gasBurned, gasFeeCharged }
            }
        }

        return {}
    }
}
