// needed for features from @iota/sdk which use reflection (decorators)
import 'reflect-metadata'
import App from './App.svelte'
import { Electron } from './lib/electron'
import { shouldReportError } from './lib/electron/utils/error.utils'

window.addEventListener('error', (event) => {
    const errorType = '[Render Context] Error'
    const hasErrorMessage = event.error && event.error.message
    const error = hasErrorMessage ? { message: event.error.message, stack: event.error.stack } : event.error || event

    if (shouldReportError(error)) {
        Electron.unhandledException(errorType, error)
    }

    event.preventDefault()
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', (event) => {
    const errorType = '[Render Context] Unhandled Rejection'
    const error = event.reason || event

    if (shouldReportError(error)) {
        Electron.unhandledException(errorType, event.reason || event)
    }

    event.preventDefault()
    console.error(event.reason)
})

const app = new App({
    target: document.getElementById('app'),
    props: {},
})

export default app
