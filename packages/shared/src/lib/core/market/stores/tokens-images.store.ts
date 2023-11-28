import { persistent } from '@core/utils/store'
import { CoinGeckoCoinImage } from '../interfaces'
import { Writable } from 'svelte/store'

export const tokensImages: Writable<Record<string, CoinGeckoCoinImage>> = persistent('tokensImages', {})
