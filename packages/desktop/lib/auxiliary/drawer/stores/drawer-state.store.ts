import { writable } from 'svelte/store'
import { DEFAULT_DRAWER_STATE } from '../constants'
import { DrawerState } from '../types'

export const drawerState = writable<DrawerState>(DEFAULT_DRAWER_STATE)
