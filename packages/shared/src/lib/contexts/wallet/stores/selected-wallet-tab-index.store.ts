import { writable } from 'svelte/store'
import { WalletTabIndex } from '../enums'

export const selectedWalletTabIndex = writable<WalletTabIndex>(WalletTabIndex.Portfolio)
