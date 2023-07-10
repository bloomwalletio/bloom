import os from 'os'
import { execSync } from 'child_process'

const MAC_OS_NAME_MAP = new Map<number, [string, string]>([
    // Source: https://en.wikipedia.org/wiki/Darwin_(operating_system)#Release_history
    [22, ['Ventura', '13']],
    [21, ['Monterey', '12']],
    [20, ['Big Sur', '11']],
    [19, ['Catalina', '10.15']],
    [18, ['Mojave', '10.14']],
    [17, ['High Sierra', '10.13']],
    [16, ['Sierra', '10.12']],
    [15, ['El Capitan', '10.11']],
    [14, ['Yosemite', '10.10']],
    [13, ['Mavericks', '10.9']],
    [12, ['Mountain Lion', '10.8']],
    [11, ['Lion', '10.7']],
    [10, ['Snow Leopard', '10.6']],
    [9, ['Leopard', '10.5']],
    [8, ['Tiger', '10.4']],
    [7, ['Panther', '10.3']],
    [6, ['Jaguar', '10.2']],
    [5, ['Puma', '10.1']],
])

interface Diagnostic {
    label: string
    value: string | number
}

export function getDiagnostics(): Diagnostic[] {
    const labelPrefix = 'popups.diagnostics.'

    return [
        { label: labelPrefix + 'platform', value: getPlatform() },
        { label: labelPrefix + 'platformVersion', value: getPlatformVersion() },
        { label: labelPrefix + 'platformArchitecture', value: os.arch() },
        { label: labelPrefix + 'cpuCount', value: os.cpus().length },
        { label: labelPrefix + 'totalMem', value: formatMemory(os.totalmem()) },
        { label: labelPrefix + 'freeMem', value: formatMemory(os.freemem()) },
    ]
}

function getPlatform(): string {
    return os.platform() === 'darwin' ? 'macOS' : os.platform()
}

function formatMemory(bytes: number): string {
    return `${(bytes / 1048576).toFixed(1)} MB`
}

export function getPlatformVersion(): string {
    if (os.platform() === 'darwin') {
        const macVersion = getMacVersion()
        if (macVersion) {
            return macVersion
        }
    }
    return os.release()
}

function getMacVersion(): string | null {
    try {
        return execSync('sw_vers -productVersion').toString().trim()
    } catch (_err) {
        const verSplit = os.release().split('.')
        const num = Number.parseInt(verSplit[0], 10)

        if (!Number.isNaN(num)) {
            const macOSVersion = MAC_OS_NAME_MAP.get(num)
            return macOSVersion ? macOSVersion[1] : ''
        }
    }
    return null
}
