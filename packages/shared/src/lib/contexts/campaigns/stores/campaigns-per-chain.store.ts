import { get, writable } from 'svelte/store'
import { ICampaign } from '../interfaces'

export const campaignsPerChain = writable<{ [chainId: number]: { [campaignId: string]: ICampaign } }>({})

export function addCampaignForChain(chainId: number, campaigns: ICampaign[]): void {
    campaignsPerChain.update((state) => {
        if (!state[chainId]) {
            state[chainId] = {}
        }
        campaigns.forEach((campaign) => {
            state[chainId][campaign.id] = campaign
        })
        return state
    })
}

export function getCampaignsForChains(chainIds: number[]): ICampaign[] {
    const _chainsPerCampaign = get(campaignsPerChain)
    let campaigns: ICampaign[] = []
    for (const chainId of chainIds) {
        const chainCampaigns = Object.values(_chainsPerCampaign[chainId] ?? {})
        campaigns = [...campaigns, ...chainCampaigns]
    }
    return campaigns
}
