export function deepEquals(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) {
        return true
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false
    }

    if (obj1 === null || obj2 === null) {
        return obj1 === null && obj2 === null
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
    }

    for (const key in obj1) {
        if (!deepEquals(obj1[key], obj2[key])) {
            return false
        }
    }

    return true
}
