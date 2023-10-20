<script lang="ts">
    import { IOption, SelectInput, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS } from '@core/nfts'

    const options: IOption[] = [30, 60, 90, 120, 150, 180].map((amount) => ({
        value: amount.toString(),
        label: assignMaxMediaDownloadTimeOptionLabel(amount),
    }))
    let selected: IOption = options.find(
        (option) =>
            option.value === $activeProfile?.settings.maxMediaDownloadTimeInSeconds.toString() ||
            option.value === DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS.toString()
    )
    $: if (selected) onMaxMediaDownloadTimeChange(selected)

    function onMaxMediaDownloadTimeChange(option: IOption): void {
        const maxMediaDownloadTimeInSeconds = parseInt(option.value)

        updateActiveProfileSettings({ maxMediaDownloadTimeInSeconds })
    }

    function assignMaxMediaDownloadTimeOptionLabel(amount: number): string {
        return amount ? localize('times.second', { values: { time: amount } }) : localize('general.none')
    }
</script>

<Text type="body2" class="mb-2">
    {localize('views.settings.maxMediaDownloadTime.title')}
</Text>
<Text type="base" textColor="secondary" class="mb-6">
    {localize('views.settings.maxMediaDownloadTime.description')}
</Text>
<SelectInput bind:selected value={selected.value} {options} />
