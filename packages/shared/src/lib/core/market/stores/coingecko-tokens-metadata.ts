import { persistent } from '@core/utils/store'
import { Writable } from 'svelte/store'
import { CoinGeckoCoin } from '../interfaces'

export const coinGeckoTokensMetadata: Writable<Record<string, CoinGeckoCoin>> = persistent(
    'coinGeckoTokensMetadata',
    {}
)
