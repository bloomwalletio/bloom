import { contextBridge, ipcRenderer } from 'electron'
import { version, productName } from '../../package.json'

interface AboutData {
    appName: string
    version: string
    iconPath: string
}

contextBridge.exposeInMainWorld('about', {
    getData: async (): Promise<AboutData> => {
        const data = await ipcRenderer.invoke('menu-data')
        const stage = process.env.STAGE

        const aboutData: AboutData = {
            appName: productName,
            version: data.strings.version.replace('{version}', version),
            iconPath: `./assets/logos/darkmode/${stage}_firefly_logo.svg`,
        }

        return aboutData
    },
})
