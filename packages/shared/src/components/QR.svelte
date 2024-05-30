<script lang="ts">
    import { default as QrCode } from 'qrious'
    import { darkMode } from '@core/app/stores'
    import { onMount } from 'svelte'
    import { MimeType } from '@core/nfts'

    export let data: string

    $: color = $darkMode ? '#ffffff' : '#000000'

    const QRcode = new QrCode()
    let image = ''

    function generateQrCode(): void {
        QRcode.set({
            background: '#ffffff00',
            foreground: color,
            level: 'L',
            padding: 0,
            size: 135,
            value: data,
        })

        image = QRcode.toDataURL(MimeType.ImagePng)
    }

    $: if (data) {
        generateQrCode()
    }

    onMount((): void => {
        generateQrCode()
    })
</script>

<div class="flex justify-center items-center">
    <img src={image} alt={data} class="qr-code" />
</div>
