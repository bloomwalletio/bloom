<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { darkMode } from '@core/app/stores'

    export let logo: LogoName
    export let width = '100%'
    export let height = '100%'
    export let classes = ''

    const logos: { [logo in LogoName]: string } = {
        [LogoName.BloomLogo]: 'bloom_logo.svg',
        [LogoName.BloomLogoFull]: 'bloom_logo_full.svg',
        [LogoName.BloomText]: 'bloom_text.svg',
        [LogoName.Stronghold]: 'stronghold.svg',
        [LogoName.Ethereum]: 'ethereum_app.svg',
    }
</script>

<img
    data-label="logo"
    class={classes}
    {width}
    {height}
    src={`assets/logos/${$darkMode ? 'darkmode' : 'lightmode'}/${logos[logo]}`}
    alt=""
/>
