<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { AddressBox } from '@ui'
    import { ContactBookRoute } from '../contact-book-route.enum'
    import { onDestroy } from 'svelte'
    import { clearSelectedContactNetworkAddress, selectedContactNetworkAddress } from '@core/contact'

    export let drawerRouter: Router<ContactBookRoute>

    const { address, addressName } = $selectedContactNetworkAddress ?? {}

    onDestroy(() => {
        clearSelectedContactNetworkAddress()
    })
</script>

<DrawerTemplate {drawerRouter} title={localize('views.dashboard.drawers.contactBook.contactAddress.title')}>
    <div class="w-full h-full flex items-center justify-center px-6">
        <AddressBox {address} showQr title={addressName} />
    </div>
</DrawerTemplate>
