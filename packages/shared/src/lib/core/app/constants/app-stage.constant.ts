import { AppStage } from '../enums'

export const APP_STAGE = process.env.STAGE ?? AppStage.ALPHA
