import { writable } from 'svelte/store'

import { IEvmNetworkStatus } from '../interfaces'
import { EvmNetworkId } from '../types'

export const evmNetworkStatuses = writable<{ [networkId in EvmNetworkId]?: IEvmNetworkStatus }>({})
