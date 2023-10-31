<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { Button, TextInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { validateProfileName } from '@core/profile/utils'
    import SettingsSection from '../SettingsSection.svelte'

    let newName = $activeProfile?.name
    let error = ''

    $: trimmedProfileName = newName.trim()
    $: newName, (error = '')
    $: disabled = invalidName(trimmedProfileName)

    function onSubmit(): void {
        try {
            validateProfileName(trimmedProfileName)
            updateActiveProfile({ name: trimmedProfileName })
            showNotification({
                variant: 'success',
                text: localize('views.settings.changeProfileName.success'),
            })
        } catch (err) {
            return (error = err.message)
        }
    }

    function invalidName(name: string): boolean {
        const isSameName = name === $activeProfile?.name
        const isTooShort = name?.length < 1
        return isSameName || isTooShort
    }
</script>

<SettingsSection
    title={localize('views.settings.changeProfileName.title')}
    description={localize('views.settings.changeProfileName.description')}
>
    <form id="form-change-profile-name" on:submit|preventDefault={onSubmit}>
        <div class="w-1/2 mb-6">
            <TextInput
                {error}
                placeholder={newName ? $activeProfile?.name : ''}
                bind:value={newName}
                label={localize('general.name')}
            />
        </div>
        <Button text={localize('views.settings.changeProfileName.title')} type="submit" {disabled} />
    </form>
</SettingsSection>
