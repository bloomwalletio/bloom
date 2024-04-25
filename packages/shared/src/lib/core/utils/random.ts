export function generateRandomId(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
        ('0' + (byte & 0xff).toString(16)).slice(-2)
    ).join('')
}

export function generateRandomInteger(beginning: number, end: number): number {
    return Math.floor(Math.random() * end + beginning)
}

export function shuffleArray<T>(array: T[]): T[] {
    const copy = structuredClone(array)

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = copy[i]
        copy[i] = copy[j]
        copy[j] = temp
    }

    return copy
}

export const pick = <T>(arr: T[]): T | undefined => {
    const length = arr?.length
    if (length < 1) return undefined

    const randIdx = Math.floor(Math.random() * length)
    return arr[randIdx] || undefined
}
