import { writable } from 'svelte/store'
import { ICampaign } from '../interfaces'

export const selectedCampaign = writable<ICampaign | undefined>(undefined)

export function setSelectedCampaign(campaign: ICampaign): void {
    selectedCampaign.set(campaign)
}
