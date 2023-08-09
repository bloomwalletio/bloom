import { isStrongholdUnlocked } from '@core/profile-manager'
import { closePopup, openPopup, PopupId, popupState } from '../../../../../../desktop/lib/auxiliary/popup'
import { get } from 'svelte/store'
import { handleError } from '@core/error/handlers/handleError'

export async function checkOrUnlockStronghold(
    callback: () => Promise<unknown> = async (): Promise<void> => {},
    reopenPopup?: boolean,
    reopenProps: Record<string, unknown> = {}
): Promise<unknown> {
    const previousPopup = get(popupState)
    function _callback(): Promise<unknown> {
        if (reopenPopup) {
            openPopup({ ...previousPopup, props: { ...previousPopup.props, ...reopenProps, _onMount: callback } })
            return Promise.resolve()
        } else {
            return callback()
        }
    }
    try {
        const strongholdUnlocked = await isStrongholdUnlocked()
        if (strongholdUnlocked) {
            return callback()
        } else {
            closePopup(true)
            openPopup({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: _callback,
                },
            })
        }
    } catch (err) {
        handleError(err)
    }
}
