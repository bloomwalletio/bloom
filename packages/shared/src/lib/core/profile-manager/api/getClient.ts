import { Client } from '@iota/sdk/out/client'
import { api } from './api'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function getClient(): Promise<Client> {
    const manager = get(profileManager)
    if (!manager) {
        return Promise.reject('No profile manager')
    }
    const { id } = manager
    return api.getClient(id)
}
