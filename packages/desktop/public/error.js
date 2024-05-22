// https://github.com/electron/electron/issues/2863
var exports = exports || {}

let errorData

window.error.getData().then((err) => {
    errorData = err
    document.getElementById('app-icon').src = errorData.iconPath
    document.getElementById('version').textContent = `App Version: ${errorData.version}`
    document.getElementById('diagnostics').textContent = errorData.diagnostics
    document.getElementById('errorType').textContent = `Error Type: ${errorData.errorType}`
    document.getElementById('details').textContent = formatError()
})

function formatError() {
    let formatted = []

    if (errorData.error) {
        if (errorData.error instanceof Error || errorData.error.stack || errorData.error.message) {
            if (errorData.error.stack) {
                formatted.push(errorData.error.stack)
            } else if (errorData.error.message) {
                formatted.push(errorData.error.message)
            }
        } else if (typeof errorData.error == 'string') {
            formatted.push(errorData.error)
        } else {
            formatted.push(JSON.stringify(errorData.error))
        }
    }

    return formatted.join('\r\n')
}

function copy() {
    let content = `App Version: ${errorData.version}\r\n\r\n`
    content += errorData.diagnostics + '\r\n\r\n'
    content += `Error Type: ${errorData.errorType}` + '\r\n\r\n'
    content += formatError()
    copyToClipboard(content)
}

function copyToClipboard(input) {
    try {
        const textArea = document.createElement('textarea')
        textArea.value = input
        document.body.appendChild(textArea)

        if (navigator.userAgent.match(/ipad|iphone/i)) {
            const range = document.createRange()
            range.selectNodeContents(textArea)
            const selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
            textArea.setSelectionRange(0, 999999)
        } else {
            textArea.select()
        }

        document.execCommand('copy')
        document.body.removeChild(textArea)
    } catch (err) {}
}

copyButton.addEventListener('click', copy)
