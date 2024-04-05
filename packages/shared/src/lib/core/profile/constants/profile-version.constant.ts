import { AppStage } from '@core/app/enums'

export const PROFILE_VERSION: Record<AppStage, number> = {
    [AppStage.ALPHA]: 12,
    [AppStage.BETA]: 1,
    [AppStage.PROD]: 7,
}
