import { IChain } from '@core/network'
import { MethodRegistry } from 'eth-method-registry'

export async function getMethodNameForData(data: string, chain: IChain): unknown {
    const fourBytePrefix = data.substring(0, 10)

    const fourByteSig = await getMethodFrom4Byte(fourBytePrefix)

    const registry = new MethodRegistry({ provider: chain.getProvider() })
    const parsedResult = registry.parse(fourByteSig)

    return {
        name: parsedResult.name,
        params: parsedResult.args,
    }
}
