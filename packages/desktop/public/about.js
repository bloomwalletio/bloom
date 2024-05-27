// https://github.com/electron/electron/issues/2863
var exports = exports || {}

window.about.getData().then((aboutData) => {
    document.getElementById('title').textContent = aboutData.appName
    document.getElementById('app-icon').src = aboutData.iconPath
    document.getElementById('app-version').textContent = aboutData.version
    document.getElementById('footer').textContent = `Bloom Labs Ltd. ${new Date().getFullYear()}`
})
