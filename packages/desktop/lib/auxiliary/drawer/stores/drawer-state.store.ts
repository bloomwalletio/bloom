import { writable } from 'svelte/store'
import { DrawerState } from '../types'

export const drawerState = writable<DrawerState | undefined>(undefined)
