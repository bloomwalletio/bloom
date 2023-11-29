import { persistent } from '@core/utils/store'
import { Writable } from 'svelte/store'
import { CoinGeckoCoin } from '../interfaces'
import { NetworkId } from '@core/network'

export const coinGeckoTokensMetadata: Writable<{ [key in NetworkId]?: Record<string, CoinGeckoCoin> }> = persistent(
    'coinGeckoTokensMetadata',
    {}
)
