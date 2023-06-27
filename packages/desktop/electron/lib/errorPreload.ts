import { contextBridge, ipcRenderer } from 'electron'
import { version } from '../../package.json'

interface ErrorData {
    iconPath: string
    version: string
    diagnostics: string
    errorType: string
    error: string
}

interface DiagnosticData {
    label: string
    value: string
}

contextBridge.exposeInMainWorld('error', {
    getData: async (): Promise<ErrorData> => {
        const data = await ipcRenderer.invoke('error-data')

        const errorData: ErrorData = {
            iconPath: './assets/logos/firefly_logo.svg',
            version,
            diagnostics: data.diagnostics
                .map((d: DiagnosticData) => `${d.label.replace('popups.diagnostics.', '')}: ${d.value}`)
                .join('\r\n'),
            errorType: data.errorType,
            error: data.error,
        }

        return errorData
    },
    openUrl: async (url: string): Promise<void> => {
        await ipcRenderer.invoke('open-url', url)
    },
})
