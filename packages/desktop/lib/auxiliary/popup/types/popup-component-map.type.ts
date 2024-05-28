import { SvelteComponent } from 'svelte'
import { PopupId } from '../enums'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PopupComponentMap = { [key in PopupId]: typeof SvelteComponent<any> }
