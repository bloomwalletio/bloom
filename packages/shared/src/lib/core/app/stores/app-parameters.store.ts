import { writable } from 'svelte/store'
import { IAppParameters } from '../interfaces'
import DefaultAppParameters from '../json/configurable-app-parameters.json'

export const appParameters = writable<IAppParameters>(DefaultAppParameters)
