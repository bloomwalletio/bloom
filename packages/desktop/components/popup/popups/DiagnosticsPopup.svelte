<script lang="ts">
    import { Platform } from '@core/app'
    import { appSettings, appVersionDetails } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { setClipboard } from '@core/utils'
    import { Text } from '@bloomwalletio/ui'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    const { loggedIn } = $activeProfile ?? {}

    let contentApp = ''
    let contentSystem = ''

    onMount(() => {
        const appVars = [
            {
                label: '',
                value: localize('general.version', {
                    values: { version: $appVersionDetails?.currentVersion },
                }),
            },
            {
                label: 'views.settings.language.title',
                value: $appSettings?.language,
            },
        ]
        if ($activeProfile && $loggedIn) {
            appVars.push({
                label: 'views.settings.currency.title',
                value: $activeProfile?.settings?.marketCurrency,
            })
            appVars.push({
                label: 'general.nodeList',
                value: $activeProfile?.clientOptions?.nodes?.map((node) => node?.url)?.toString(),
            })
        }
        contentApp = concatenateInfo(appVars)
        void Platform.getDiagnostics().then((values) => (contentSystem = concatenateInfo(values)))
    })

    function onCopyClick(): void {
        setClipboard(contentApp + '\r\n' + contentSystem)
    }

    function concatenateInfo(infoList: { label?: string; value: string }[]): string {
        return infoList.map((info) => (info.label ? `${localize(info.label)}: ${info.value}` : info.value)).join('\r\n')
    }
</script>

<PopupTemplate
    title={localize('popups.diagnostics.title')}
    continueButton={{
        text: localize('actions.copy'),
        onClick: onCopyClick,
    }}
>
    <Text type="pre-sm" fontWeight="normal" textColor="secondary">{contentApp}</Text>
    <Text type="pre-sm" fontWeight="normal" textColor="secondary">{contentSystem}</Text>
</PopupTemplate>
