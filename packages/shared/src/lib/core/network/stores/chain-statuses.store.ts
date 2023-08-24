import { writable } from 'svelte/store'

import { IChainStatus } from '../interfaces'
import { NetworkId } from '../types'

export const chainStatuses = writable<{ [networkId in NetworkId]?: IChainStatus }>({})
