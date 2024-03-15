import { IAppUpdateDownloadProgress, IAppVersionDetails, INFTDownloadState } from '.'
import { IEvmAddress, IEvmSignature } from '@core/layer-2/interfaces'
import { ILedgerEthereumAppSettings } from '@core/ledger/interfaces'

export interface IPlatformEventMap {
    'deep-link-request': string
    'ethereum-app-settings': ILedgerEthereumAppSettings
    'evm-address': IEvmAddress
    'evm-signed-transaction': IEvmSignature
    'ledger-error': Error
    'lock-screen': void
    'log-error': void
    'menu-check-for-update': void
    'menu-diagnostics': void
    'menu-error-log': void
    'menu-logout': void
    'menu-navigate-settings': void
    'menu-navigate-wallet': void
    'native-theme-updated': void
    'nft-download-done': INFTDownloadState
    'nft-download-interrupted': INFTDownloadState
    'notification-activated': unknown
    'signed-eip712': IEvmSignature
    'signed-message': IEvmSignature
    'transak-not-loaded': void
    'transak-url': string
    'version-complete': void
    'version-details': IAppVersionDetails
    'version-error': Error
    'version-progress': IAppUpdateDownloadProgress
    'try-open-url-in-browser': string
}
