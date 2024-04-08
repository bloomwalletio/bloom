import { ipcRenderer } from 'electron'

/* Transak adds the style attribute in <html> with the theme color when it loads */
function observeStyleChanges(targetNode: Element): { disconnect: () => void } {
    const config = {
        attributes: true,
        attributeFilter: ['style'],
    }

    const callback = (mutationsList: MutationRecord[], observer: MutationObserver) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                clearTimeout(fallbackTimeout)
                void ipcRenderer.invoke('transak-loaded')
                observer.disconnect()
                break
            }
        }
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)

    const fallbackTimeout = setTimeout(() => {
        observer.disconnect()
    }, 5000)

    return {
        disconnect: () => observer.disconnect(),
    }
}

window.addEventListener('DOMContentLoaded', () => {
    observeStyleChanges(window.document.documentElement)

    const appRoot = window.document.getElementById('appRoot')
    if (appRoot) {
        appRoot.style.borderRadius = '16px'
        appRoot.style.overflow = 'hidden'
    }
})
