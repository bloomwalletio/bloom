import { Client } from '@iota/sdk/out/client'
import { api } from './api'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

let client: Client | undefined

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

export async function resetClient(): Promise<void> {
    if (client) {
        await client.destroy()
    }
    client = undefined
}
