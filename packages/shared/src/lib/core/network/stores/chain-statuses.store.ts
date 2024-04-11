import { writable } from 'svelte/store'

import { IChainStatus } from '../interfaces'
import { EvmNetworkId } from '../types'

export const chainStatuses = writable<{ [networkId in EvmNetworkId]?: IChainStatus }>({})
