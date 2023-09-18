import { SmartContract } from '../types'

export function parseLayer2Metadata(metadata: string | undefined): SmartContract | undefined {
    if (!metadata) {
        return undefined
    }
    try {
        const parsedData = JSON.parse(metadata)
        validate(parsedData)

        return { ...parsedData }
    } catch (error) {
        return undefined
    }
}

function validate(data: SmartContract): void {
    if (!data) {
        throw new Error('Invalid Metadata')
    }

    if (data.senderContract && typeof data.senderContract !== 'string') {
        throw new Error('Invalid senderContract')
    }

    if (data.targetContract && typeof data.targetContract !== 'string') {
        throw new Error('Invalid targetContract')
    }

    if (data.contractFunction && typeof data.contractFunction !== 'string') {
        throw new Error('Invalid contractFunction')
    }

    if (data.gasLimit) {
        try {
            parseInt(data.gasLimit, 10)
        } catch (error) {
            throw new Error('Invalid gasLimit')
        }
    }

    if (data.ethereumAddress && typeof data.ethereumAddress !== 'string') {
        throw new Error('Invalid ethereumAddress')
    }
}
