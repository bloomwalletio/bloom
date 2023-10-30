<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { Button, Text, TextInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { validateProfileName } from '@core/profile/utils'

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

<form id="form-change-profile-name" on:submit|preventDefault={onSubmit}>
    <Text type="body2" class="mb-2">
        {localize('views.settings.changeProfileName.title')}
    </Text>
    <Text type="base" textColor="secondary" class="mb-6">
        {localize('views.settings.changeProfileName.description')}
    </Text>
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
