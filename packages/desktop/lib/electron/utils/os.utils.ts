import { machineIdSync } from 'node-machine-id'

let machineId: string | null = null

export function getMachineId(): string {
    if (!machineId) {
        try {
            machineId = machineIdSync()
        } catch (err) {
            machineId = ''
            console.error(err)
        }
    }

    return machineId || ''
}
