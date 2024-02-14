<script lang="ts">
    import { KeyValue } from '@ui'
    import type { IAuth } from '@iota/sdk'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { TextInput, Tabs } from '@bloomwalletio/ui'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { IError } from '@core/error'

    export let onSubmit: (auth: IAuth) => unknown = () => {}

    enum Auth {
        Credentials = 'credentials',
        Jwt = 'jwt',
    }

    const tabs: KeyValue<string>[] = [
        { key: Auth.Credentials, value: localize('popups.node.credentials') },
        { key: Auth.Jwt, value: localize('popups.node.jwt') },
    ]
    let selectedTab = tabs[0]

    let isBusy = false

    let username: string
    let password: string

    let jwt: string
    let jwtError: string | undefined

    $: isJwtAuthentication = selectedTab.key === Auth.Jwt
    $: disabled = isBusy || (isJwtAuthentication ? !jwt : !username || !password)

    async function onConfirmClick(): Promise<void> {
        try {
            isBusy = true
            const auth = isJwtAuthentication ? { jwt } : { basicAuthNamePwd: [username, password] as [string, string] }
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
        form: 'node-auth-required',
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled,
    }}
    busy={isBusy}
>
    <form id="node-auth-required" on:submit|preventDefault={onConfirmClick}>
        <div class="flex flex-col w-full space-y-4">
            <Tabs bind:selectedTab {tabs} />
            {#if isJwtAuthentication}
                <TextInput bind:value={jwt} error={jwtError} label={localize('popups.node.jwt')} />
            {:else}
                <TextInput bind:value={username} label={localize('general.username')} />
                <TextInput bind:value={password} label={localize('general.password')} />
            {/if}
        </div>
    </form>
</PopupTemplate>
