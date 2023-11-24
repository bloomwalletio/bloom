import { persistent } from '@core/utils/store'
import { CoinGeckoCoinImage } from '../interfaces'
import { Writable } from 'svelte/store'

export const shimmerEvmTokensImages: Writable<Record<string, CoinGeckoCoinImage>> = persistent(
    'shimmerEvmTokensImages',
    {}
)
