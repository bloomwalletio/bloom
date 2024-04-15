import { AppStage } from '@core/app/enums'

export const PROFILE_VERSION: Record<AppStage, number> = {
    [AppStage.ALPHA]: 13,
    [AppStage.BETA]: 1,
    [AppStage.PROD]: 7,
}
