<script lang="ts">
    import { NodeAuthTab } from '@ui'
    import type { IAuth } from '@iota/sdk'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { IError } from '@core/error'

    export let onSubmit: (auth: IAuth) => unknown = () => {}

    let isBusy = false
    let auth: IAuth
    let jwtError: string | undefined

    $: disabled = isBusy || !auth

    async function onConfirmClick(): Promise<void> {
        try {
            isBusy = true
            await onSubmit(auth)
            isBusy = false
        } catch (err) {
            const error = err as IError
            isBusy = false
            const authenticationError = error?.error?.match(/(jwt)/g)?.[0]
            switch (authenticationError) {
                case 'jwt':
                    jwtError = error?.error
                    break
                default:
                    handleError(error)
                    break
            }
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<PopupTemplate
    title={localize('popups.nodeAuthRequired.title')}
    description={localize('popups.nodeAuthRequired.body')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled,
    }}
    busy={isBusy}
>
    <NodeAuthTab bind:auth {jwtError} />
</PopupTemplate>
