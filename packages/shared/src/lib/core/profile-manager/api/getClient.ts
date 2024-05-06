import { Client } from '@iota/sdk/out/client'
import { api } from './api'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

let client

export async function getClient(): Promise<Client> {
    if (!client) {
        const manager = get(profileManager)
        if (!manager) {
            return Promise.reject('No profile manager')
        }
        client = await api.getClient(manager.id)
    }
    return client
}

export function resetClient(): void {
    client = undefined
}
