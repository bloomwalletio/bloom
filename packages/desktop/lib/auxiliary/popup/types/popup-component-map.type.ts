import { SvelteComponent } from 'svelte'
import { PopupId } from '../enums'

export type PopupComponentMap = { [key in PopupId]: SvelteComponent }
