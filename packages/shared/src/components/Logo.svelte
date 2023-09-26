<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { appSettings } from '@core/app/stores'

    export let logo: LogoName
    export let width = '100%'
    export let height = '100%'
    export let classes = ''

    $: darkModeEnabled = $appSettings.darkMode

    const logos: { [logo in LogoName]: string } = {
        [LogoName.Bloom]: 'bloom_logo_full.svg',
        [LogoName.Stronghold]: 'stronghold.svg',
        [LogoName.Ethereum]: 'ethereum_app.svg',
    }
</script>

<img
    data-label="logo"
    class={classes}
    {width}
    {height}
    src={`assets/logos/${darkModeEnabled ? 'darkmode' : 'lightmode'}/${logos[logo]}`}
    alt=""
/>
