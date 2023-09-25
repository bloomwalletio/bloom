<script lang="ts">
    import { appSettings } from '@core/app/stores'

    export let logo: 'stronghold' | 'bloom' | 'ethereum'
    export let width = '100%'
    export let height = '100%'
    export let classes = ''

    $: darkModeEnabled = $appSettings.darkMode

    const logos = {
        stronghold: 'stronghold.svg',
        bloom: 'bloom_logo_full.svg',
        ethereum: 'ethereum_app.svg',
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
