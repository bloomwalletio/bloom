import { AppStage } from '@core/app/enums'

export const PROFILE_VERSION: Record<AppStage, number> = {
    [AppStage.ALPHA]: 7,
    [AppStage.BETA]: 0,
    [AppStage.PROD]: 4,
}
