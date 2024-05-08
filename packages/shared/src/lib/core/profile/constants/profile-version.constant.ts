import { AppStage } from '@core/app/enums'

export const PROFILE_VERSION: Record<AppStage, number> = {
    [AppStage.ALPHA]: 18,
    [AppStage.BETA]: 1,
    [AppStage.PROD]: 9,
}
