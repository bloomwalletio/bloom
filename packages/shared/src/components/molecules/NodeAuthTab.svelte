<script lang="ts">
    import { KeyValue } from '@ui'
    import { localize } from '@core/i18n'
    import { PasswordInput, TextInput, Tabs } from '@bloomwalletio/ui'
    import { IAuth } from '@iota/sdk'

    export let auth: IAuth | undefined
    export let jwtError: string | undefined = undefined

    let [username, password] = auth?.basicAuthNamePwd ?? ['', '']
    let jwt = auth?.jwt ?? ''

    enum Auth {
        Credentials = 'credentials',
        Jwt = 'jwt',
    }

    const tabs: KeyValue<string>[] = [
        { key: Auth.Credentials, value: localize('popups.node.credentials') },
        { key: Auth.Jwt, value: localize('popups.node.jwt') },
    ]
    let selectedTab = tabs[0]

    $: isJwtAuthentication = selectedTab.key === Auth.Jwt
    $: selectedTab, jwt, username, password, setAuth()

    function setAuth(): void {
        if (isJwtAuthentication && jwt) {
            auth = { jwt }
        } else if (!isJwtAuthentication && username && password) {
            auth = { basicAuthNamePwd: [username, password] as [string, string] }
        } else {
            auth = undefined
        }
    }
</script>

<div class="flex flex-col w-full space-y-4">
    <Tabs bind:selectedTab {tabs} />
    {#if isJwtAuthentication}
        <TextInput bind:value={jwt} error={jwtError} label={localize('popups.node.jwt')} />
    {:else}
        <TextInput bind:value={username} label={localize('general.username')} />
        <PasswordInput bind:value={password} minlength={1} label={localize('general.password')} />
    {/if}
</div>
