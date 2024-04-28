import { KeyValue } from '@ui'
import { Writable, writable } from 'svelte/store'
import { COLLECTIBLES_TABS } from '../constants'

export const selectedCollectiblesTab: Writable<KeyValue<string>> = writable(COLLECTIBLES_TABS[0])
