<script lang="ts">
    import { Input, Text, TextType } from '@ui'
    import { showNotification } from '@auxiliary/notification'
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { validateProfileName } from '@core/profile'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'

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
    <Text type={TextType.h4} classes="mb-3">
        {localize('views.settings.changeProfileName.title')}
    </Text>
    <Text type={TextType.p} secondary classes="mb-5">
        {localize('views.settings.changeProfileName.description')}
    </Text>
    <Input {error} placeholder={$activeProfile?.name} bind:value={newName} classes="mb-5" />
    <Button text={localize('views.settings.changeProfileName.title')} type="submit" {disabled} />
</form>
