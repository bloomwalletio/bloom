import { AppStage } from '../enums'

export const APP_STAGE: AppStage = (process.env.STAGE ?? AppStage.ALPHA) as AppStage
