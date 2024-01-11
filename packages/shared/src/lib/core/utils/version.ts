export function isVersionLessThan(version: string, target: string): boolean {
    const [major, minor, patch] = version.split('.')
    const [targetMajor, targetMinor, targetPatch] = target.split('.')
    if (major < targetMajor) {
        return true
    } else if (major === targetMajor) {
        if (minor < targetMinor) {
            return true
        } else if (minor === targetMinor) {
            if (patch < targetPatch) {
                return true
            }
        }
    }
    return false
}

export function isVersionGreaterThan(version: string, target: string): boolean {
    const [major, minor, patch] = version.split('.')
    const [targetMajor, targetMinor, targetPatch] = target.split('.')
    if (major > targetMajor) {
        return true
    } else if (major === targetMajor) {
        if (minor > targetMinor) {
            return true
        } else if (minor === targetMinor) {
            if (patch > targetPatch) {
                return true
            }
        }
    }
    return false
}
