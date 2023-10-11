<script lang="ts">
    import { Platform } from '@core/app'
    import { appSettings, appVersionDetails } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { setClipboard } from '@core/utils'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { IItem, Table, Tabs } from '@bloomwalletio/ui'

    enum Tab {
        App = 'app',
        System = 'system',
    }

    let selectedTab: { key: string; value: string }

    let itemsMap: {
        [Tab.App]: IItem[]
        [Tab.System]: IItem[]
    } = {
        [Tab.App]: [],
        [Tab.System]: [],
    }

    onMount(async () => {
        const appInfo = [
            { key: localize('general.version'), value: $appVersionDetails?.currentVersion },
            { key: localize('views.settings.language.title'), value: $appSettings?.language },
            { key: localize('views.settings.currency.title'), value: $activeProfile?.settings?.marketCurrency },
            {
                key: localize('general.nodeList'),
                value: $activeProfile?.clientOptions?.nodes?.map((node) => node?.url)?.toString(),
            },
        ]

        const rawSystemInfo = await Platform.getDiagnostics()
        const systemInfo = rawSystemInfo.map((val) => ({ key: localize(val.label), value: val.value }))
        itemsMap = {
            [Tab.App]: appInfo,
            [Tab.System]: systemInfo,
        }
    })

    function onCopyClick(): void {
        setClipboard(concatenateInfo(itemsMap[Tab.App]) + '\r\n' + concatenateInfo(itemsMap[Tab.System]))
    }

    function concatenateInfo(infoList: IItem[]): string {
        return infoList
            .map((info) => (info.key ? `${localize(info.key)}: ${String(info.value)}` : info.value))
            .join('\r\n')
    }
</script>

<PopupTemplate
    title={localize('popups.diagnostics.title')}
    continueButton={{
        text: localize('actions.copy'),
        onClick: onCopyClick,
    }}
>
    <div class="flex">
        <Tabs
            bind:selectedTab
            tabs={Object.values(Tab).map((key) => ({ key, value: localize(`popups.diagnostics.${key}`) }))}
        />
    </div>
    <Table items={itemsMap[selectedTab?.key] ?? []} />
</PopupTemplate>
