import { Platform } from '../classes'
import { resetAppUpdateState } from '../stores'

/**
 * Initializes the download for an application update.
 */
export function downloadAppUpdate(): void {
    resetAppUpdateState()
    void Platform.downloadAppUpdate()

    // let notificationId = undefined

    /*     const unsubscribeProgress = appUpdateProgress.subscribe((progress) => {
        updateDisplayNotificationProgress(notificationId, progress)
    })
 */
    /*     const unsubscribeMinutesRemaining = appUpdateMinutesRemaining.subscribe((minutesRemaining) => {
        if (minutesRemaining > 0) {
            updateDisplayNotification(notificationId, {
                ...downloadingNotification,
                subMessage:
                    minutesRemaining === -1
                        ? localize('notifications.calcMinutesRemaining')
                        : (minutesRemaining < 1 ? '< ' : '') +
                          localize('notifications.minutesRemaining', {
                              values: {
                                  minutes: Math.ceil(minutesRemaining).toString(),
                              },
                          }),
            })
        }
    }) */

    /*     const unsubscribeUpdateComplete = appUpdateComplete.subscribe((isComplete) => {
        if (isComplete) {
            updateDisplayNotification(notificationId, {
                ...downloadingNotification,
                message: localize('notifications.updateReady'),
                subMessage: localize('notifications.restartInstall'),
                progress: undefined,
                actions: [
                    {
                        label: localize('actions.restartNow'),
                        callback: restartNow,
                        isPrimary: true,
                    },
                    {
                        label: localize('actions.dismiss'),
                        callback: cleanup,
                    },
                ],
            })
        }
    }) */

    /*     const unsubscribeErrors = appUpdateError.subscribe((isError) => {
        if (isError) {
            updateDisplayNotification(notificationId, {
                ...downloadingNotification,
                type: 'error',
                message: localize('notifications.updateError'),
                progress: undefined,
                actions: [
                    {
                        label: localize('actions.dismiss'),
                        callback: cleanup,
                        isPrimary: true,
                    },
                ],
            })
        }
    }) */

    /* function restartNow(): void {
        cleanup()
        installAppUpdate()
    } */

    /*     function cleanup(): void {
        removeAppNotification(notificationId)

        unsubscribeProgress()
        unsubscribeUpdateComplete()
        unsubscribeErrors()
        unsubscribeMinutesRemaining()
    } */

    /*     const downloadingNotification: INotification = {
        variant: 'info',
        text: localize('notifications.downloadingUpdate'),
        progress: 0,
        subMessage: localize('notifications.calcMinutesRemaining'),
        actions: [
            {
                label: localize('actions.cancel'),
                callback: (): void => {
                    cancelAppUpdateDownload()
                    cleanup()
                },
            },
        ],
        timeout: NOTIFICATION_DURATION_NONE,
    } */

    // notificationId = showNotification(downloadingNotification)
}
