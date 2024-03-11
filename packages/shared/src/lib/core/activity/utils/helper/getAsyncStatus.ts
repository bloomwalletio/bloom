import { StardustActivityAsyncStatus } from '@core/activity/enums'

export function getAsyncStatus(
    isClaimed: boolean,
    expirationDate: Date | undefined,
    timelockDate: Date | undefined,
    hasStorageDeposit: boolean,
    currentTimeStamp: number
): StardustActivityAsyncStatus {
    if (isClaimed) {
        return StardustActivityAsyncStatus.Claimed
    } else if (timelockDate && timelockDate.getTime() > currentTimeStamp) {
        return StardustActivityAsyncStatus.Timelocked
    } else if (expirationDate && expirationDate.getTime() < currentTimeStamp) {
        return StardustActivityAsyncStatus.Expired
    } else if (hasStorageDeposit || expirationDate) {
        return StardustActivityAsyncStatus.Unclaimed
    } else if (timelockDate) {
        return StardustActivityAsyncStatus.Claimed
    } else {
        return StardustActivityAsyncStatus.Unclaimed
    }
}
