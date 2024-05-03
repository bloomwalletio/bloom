import { app } from 'electron'

export const APP_PATH = app.isPackaged ? app.getAppPath() : __dirname
