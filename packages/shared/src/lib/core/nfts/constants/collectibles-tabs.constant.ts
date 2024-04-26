import { KeyValue } from '@ui'
import features from '@features/features'

export const COLLECTIBLES_TABS: KeyValue<string>[] = [
    { key: 'collectibles', value: 'Collectibles' },
    ...(features.collectibles?.collections.enabled ? [{ key: 'collections', value: 'Collections' }] : []),
]
