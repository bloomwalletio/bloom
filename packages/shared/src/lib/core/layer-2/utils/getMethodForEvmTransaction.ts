import { lookupMethodSignature } from './lookupMethodSignature'

export function getMethodForEvmTransaction(rawData: string): [string, Record<string, string>] | undefined {
    const fourBytePrefix = rawData.substring(0, 10)
    try {
        const result = lookupMethodSignature(fourBytePrefix)
        if (!result) {
            throw Error('Method could not be found!')
        }

        const matches = /(\w+)\((.*)\)$/.exec(result)
        if (!matches) {
            throw Error('Method signature could not be parsed!')
        }

        const name = matches[1]
        const parametersArr = matches[2] ?? ''

        const parameters: Record<string, string> = parametersArr.split(',').reduce(
            (acc, type, index) => {
                acc[`param${index}`] = type
                return acc
            },
            {} as Record<string, string>
        )

        return [name, parameters]
    } catch (error) {
        return undefined
    }
}
