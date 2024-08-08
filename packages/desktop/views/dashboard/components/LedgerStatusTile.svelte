<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile, StatusTileProps } from '@components'
    import { localize } from '@core/i18n'
    import {
        LedgerAppName,
        LedgerConnectionState,
        MINIMUM_SUPPORTED_LEDGER_APP_VERSION,
        ledgerConnectionAppState,
    } from '@core/ledger'
    import { ILedgerConnectionAppState } from '@core/ledger/interfaces/ledger-connection-app-state.interface'

    $: statusTileProps = setStatusTileProps($ledgerConnectionAppState)

    function setStatusTileProps(connectionState: ILedgerConnectionAppState): StatusTileProps {
        let subtitle: string
        let logo: LogoName | undefined = undefined
        let iconName: IconName | undefined = undefined
        let iconColor: string | undefined = undefined
        let iconBackgroundColor: string | undefined = undefined

        switch (connectionState?.state) {
            case LedgerConnectionState.AppNotOpen:
                subtitle = localize('general.unlocked')
                iconName = IconName.Hardware
                iconColor = 'neutral'
                break
            case LedgerConnectionState.AppOpen:
            case LedgerConnectionState.UnsupportedVersion:
                switch (connectionState?.app) {
                    case LedgerAppName.Iota:
                        subtitle = 'IOTA App'
                        iconName = IconName.Iota
                        iconColor = '#ffffff'
                        iconBackgroundColor = '#000000'
                        break
                    case LedgerAppName.Shimmer:
                        subtitle = 'Shimmer App'
                        iconName = IconName.Shimmer
                        iconColor = 'shimmer'
                        iconBackgroundColor = 'shimmer-background'
                        break
                    case LedgerAppName.Ethereum:
                        subtitle = 'Ethereum App'
                        logo = LogoName.Ethereum
                        iconBackgroundColor = 'ethereum'
                        break
                    default:
                        subtitle = localize('general.disconnected')
                        iconName = IconName.ZapOff
                        iconColor = 'danger'
                        break
                }
                break
            case LedgerConnectionState.Locked:
                subtitle = localize('general.locked')
                iconName = IconName.Hardware
                iconColor = 'success'
                break
            case LedgerConnectionState.Disconnected:
            default:
                subtitle = localize('general.disconnected')
                iconName = IconName.ZapOff
                iconColor = 'danger'
                break
        }

        return {
            title: localize('general.ledgerDevice'),
            subtitle,
            logo,
            iconName,
            iconColor,
            iconBackgroundColor,
            warning:
                connectionState?.state === LedgerConnectionState.UnsupportedVersion && connectionState.app
                    ? localize('views.onboarding.createFromLedger.connectLedger.unsupportedVersion', {
                          appName: connectionState.app,
                          minimumVersion: MINIMUM_SUPPORTED_LEDGER_APP_VERSION[connectionState.app],
                      })
                    : undefined,
        }
    }
</script>

<StatusTile {statusTileProps} />
