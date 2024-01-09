import { isStrongholdUnlocked } from '@core/profile-manager'
import { openProfileAuthPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'

export async function checkOrUnlockStrongholdAsync(): Promise<void> {
    const strongholdUnlocked = await isStrongholdUnlocked()
    return new Promise((resolve, reject) => {
        if (strongholdUnlocked) {
            resolve()
            return
        } else {
            openProfileAuthPopup({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: resolve,
                    onCancel: reject,
                },
            })
        }
    })
}
