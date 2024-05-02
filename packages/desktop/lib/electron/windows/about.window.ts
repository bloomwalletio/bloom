import { BrowserWindow, app } from 'electron'
import { windows } from '../constants/windows.constant'
import path from 'path'
import { DEFAULT_WEB_PREFERENCES } from '../constants/default-web-preferences.constant'
import { APP_PATH } from '../constants/app-path.constant'

const ABOUT_WINDOW_PRELOAD_FILE_NAME = 'about.preload.js'
const ABOUT_WINDOW_HTML_FILE_NAME = 'about.html'

export abstract class AboutWindow {
    /**
     * Create about window
     * @returns {BrowserWindow} About window
     */
    static open(this: void): BrowserWindow {
        if (windows.about !== null) {
            windows.about.focus()
            return windows.about
        }

        const preloadPath = path.join(APP_PATH, app.isPackaged ? 'public/build' : '', ABOUT_WINDOW_PRELOAD_FILE_NAME)

        windows.about = new BrowserWindow({
            width: 380,
            height: 230,
            useContentSize: true,
            titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
            /**
             * NOTE: This only affects Windows.
             */
            titleBarOverlay: {
                color: '#161926',
                symbolColor: '#ffffff',
            },
            show: true,
            fullscreenable: false,
            resizable: false,
            minimizable: false,
            webPreferences: {
                ...DEFAULT_WEB_PREFERENCES,
                preload: preloadPath,
            },
        })

        const htmlPath = path.join(APP_PATH, app.isPackaged ? 'public' : '..', ABOUT_WINDOW_HTML_FILE_NAME)

        void windows.about.loadFile(htmlPath)

        windows.about.setMenu(null)

        windows.about.once('closed', () => {
            windows.about = null
        })

        return windows.about
    }

    static close(this: void): void {
        if (windows.about) {
            windows.about.close()
            windows.about = null
        }
    }
}
