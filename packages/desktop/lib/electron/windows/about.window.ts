import { BrowserWindow, app } from 'electron'
import { windows } from '../constants/windows.constant'
import path from 'path'
import { DEFAULT_WEB_PREFERENCES } from '../constants/default-web-preferences.constant'
import { APP_PATH } from '../constants/app-path.constant'

const ABOUT_WINDOW_PRELOAD_FILE_NAME = 'about.preload.js'
const ABOUT_WINDOW_HTML_FILE_NAME = 'about.html'

const ABOUT_WINDOW_WIDTH = 380
const ABOUT_WINDOW_HEIGHT = 230

export abstract class AboutWindow {
    /**
     * Create about window
     * @returns {BrowserWindow} About window
     */
    static open(this: void): BrowserWindow {
        if (windows.about !== null) {
            windows.about.setBounds(AboutWindow.calculatePosition())
            windows.about.focus()
            return windows.about
        }

        const preloadPath = path.join(APP_PATH, app.isPackaged ? 'public/build' : '', ABOUT_WINDOW_PRELOAD_FILE_NAME)
        const htmlPath = path.join(APP_PATH, app.isPackaged ? 'public' : '..', ABOUT_WINDOW_HTML_FILE_NAME)

        windows.about = new BrowserWindow({
            width: ABOUT_WINDOW_WIDTH,
            height: ABOUT_WINDOW_HEIGHT,
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
            ...AboutWindow.calculatePosition(),
        })

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

    static calculatePosition(): { x: number; y: number } {
        const mainWindowBounds = BrowserWindow.getFocusedWindow()?.getBounds() ?? { x: 0, y: 0, width: 0, height: 0 }
        const mainWindowCenterX = mainWindowBounds?.x + mainWindowBounds?.width / 2
        const mainWindowCenterY = mainWindowBounds?.y + mainWindowBounds?.height / 2

        const ABOUT_WINDOW_WIDTH = 380
        const ABOUT_WINDOW_HEIGHT = 230

        const x = mainWindowCenterX - ABOUT_WINDOW_WIDTH / 2
        const y = mainWindowCenterY - ABOUT_WINDOW_HEIGHT / 2

        return { x, y }
    }
}
