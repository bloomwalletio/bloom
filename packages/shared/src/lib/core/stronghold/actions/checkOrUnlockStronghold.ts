import { isStrongholdUnlocked } from '@core/profile-manager'
import { openProfileAuthPopup, ProfileAuthPopupId } from '../../../../../../desktop/lib/auxiliary/popup'

export async function checkOrUnlockStronghold(): Promise<void> {
    const strongholdUnlocked = await isStrongholdUnlocked()
    return new Promise((resolve, reject) => {
        if (strongholdUnlocked) {
            resolve()
            return
        } else {
            openProfileAuthPopup({
                id: ProfileAuthPopupId.UnlockStronghold,
                props: {
                    onSuccess: resolve,
                    onCancel: reject,
                },
            })
        }
    })
}
