<script lang="ts">
    import { Table, type IItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IPersistedProfile, ProfileType, getStorageDirectoryOfProfile } from '@core/profile'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { setClipboard } from '@core/utils'

    export let profile: IPersistedProfile

    let items: IItem[] = []
    onMount(async () => {
        const location = await getStorageDirectoryOfProfile(profile.id)
        items = [
            { key: localize('general.name'), value: profile.name },
            { key: localize('general.id'), value: profile.id, copyable: true },
            { key: localize('general.version'), value: `${profile?.versionTrack} v${profile.version}` },
        ]
        if (profile.type === ProfileType.Software) {
            items = [
                ...items,
                {
                    key: `${localize('general.type')}`,
                    value: `${localize('general.stronghold')} v${profile.strongholdVersion}`,
                },
            ]
        } else {
            items = [...items, { key: `${localize('general.type')}`, value: profile.type }]
        }
        if (location) {
            items = [...items, { key: localize('general.location'), value: location, copyable: true }]
        }
    })

    function onCopyClick(): void {
        const rawItemsString = items.map((item) => `${item.key}: ${String(item.value)}`).join('\r\n')
        setClipboard(rawItemsString)
    }
</script>

<PopupTemplate
    title={localize('popups.profileDiagnostics.title')}
    continueButton={{
        text: localize('actions.copy'),
        onClick: onCopyClick,
    }}
>
    {#key items}
        <Table {items} />
    {/key}
</PopupTemplate>
