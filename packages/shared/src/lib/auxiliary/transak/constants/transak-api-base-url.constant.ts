import { AppStage } from '@core/app/enums/app-stage.enum'
import { TRANSAK_API_PRODUCTION_BASE_URL } from './transak-api-production-base-url.constant'
import { TRANSAK_API_STAGING_BASE_URL } from './transak-api-staging-base-url.constant'

export const TRANSAK_API_BASE_URL =
    process.env.STAGE === AppStage.PROD ? TRANSAK_API_PRODUCTION_BASE_URL : TRANSAK_API_STAGING_BASE_URL
