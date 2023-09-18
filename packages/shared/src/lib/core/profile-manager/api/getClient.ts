import { get } from 'svelte/store'
import { Client } from '@iota/sdk/out/client'
import { profileManager } from '../stores'
import { api } from './api'

export function getClient(manager = profileManager): Promise<Client> {
    const { id } = get(manager)
    return api.getClient(id)
}
