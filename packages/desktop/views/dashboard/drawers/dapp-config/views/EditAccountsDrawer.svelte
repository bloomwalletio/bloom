<script lang="ts">
    import { Router } from '@core/router'
    import { EditSelectionDrawer, AccountSelection } from '../components'
    import { IAccountState } from '@core/account'

    export let drawerRouter: Router<unknown>

    let checkedAccounts: IAccountState[] = []
</script>

<EditSelectionDrawer
    {drawerRouter}
    titleLocale="dapps.editAccounts"
    selections={{ accounts: checkedAccounts }}
    let:persistedSupportedNamespaces
    disableContinue={checkedAccounts.length === 0}
>
    <AccountSelection bind:checkedAccounts supportedNamespaces={persistedSupportedNamespaces} />
</EditSelectionDrawer>
