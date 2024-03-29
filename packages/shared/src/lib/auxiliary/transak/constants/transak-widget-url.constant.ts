import { AppStage } from '@core/app/enums/app-stage.enum'
import { TRANSAK_PRODUCTION_WIDGET_URL, TRANSAK_STAGING_WIDGET_URL } from '.'

export const TRANSAK_WIDGET_URL =
    process.env.STAGE === AppStage.PROD ? TRANSAK_PRODUCTION_WIDGET_URL : TRANSAK_STAGING_WIDGET_URL
