<script lang="ts">
    import { activeProfile } from '@core/profile/stores'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { Pane, Text, TextType } from '@ui'
    import {
        CreateAliasButton,
        FaucetRequestButton,
        MintNativeTokenButton,
        MintNftButton,
        TestDeepLinkButton,
    } from './components'
    import { DashboardRoute, dashboardRouter } from '@core/router'
    import { Platform } from '@core/app'

    $: !$activeProfile.isDeveloperProfile && $dashboardRouter.goTo(DashboardRoute.Wallet)

    $: if (features.analytics.dashboardRoute.developer.enabled) {
        Platform.trackEvent('developer-route', { route: DashboardRoute.Developer })
    }
</script>

{#if $selectedAccount}
    <div class="w-full h-full flex flex-nowrap p-8 relative flex-1 justify-center items-start">
        {#key $selectedAccount?.index}
            <div class="flex columns-3 gap-4 min-h-0 min-w-0 max-w-7xl">
                <Pane classes="flex flex-col p-6 space-y-6">
                    <Text type={TextType.h5} classes="text-left">
                        {localize('general.assets')}
                    </Text>
                    {#if features.developerTools.alias.enabled}
                        <CreateAliasButton />
                    {/if}
                    {#if features.developerTools.mintNativeTokens.enabled}
                        <MintNativeTokenButton />
                    {/if}
                    {#if features.developerTools.mintNft.enabled}
                        <MintNftButton />
                    {/if}
                </Pane>
                <Pane classes="flex flex-col p-6 space-y-6">
                    <Text type={TextType.h5} classes="text-left">
                        {localize('general.developerTools')}
                    </Text>
                    {#if features.developerTools.faucet.enabled}
                        <FaucetRequestButton />
                    {/if}
                    {#if features.developerTools.deeplink.enabled}
                        <TestDeepLinkButton />
                    {/if}
                </Pane>
            </div>
        {/key}
    </div>
{/if}
