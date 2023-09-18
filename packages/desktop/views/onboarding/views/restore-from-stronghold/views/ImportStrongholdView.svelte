<script lang="ts">
    import { onMount } from 'svelte'
    import { Dropzone } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { ImportFile, onboardingProfile, updateOnboardingProfile, validateBackupFile } from '@contexts/onboarding'
    import { CLIENT_ERROR_REGEXES } from '@core/error/constants'
    import { ClientError } from '@core/error/enums'
    import { localize } from '@core/i18n'
    import { restoreBackup } from '@core/profile-manager/api'
    import { STRONGHOLD_VERSION } from '@core/stronghold/constants'
    import { StrongholdVersion } from '@core/stronghold/enums'
    import { restoreFromStrongholdRouter } from '../../restore-from-stronghold/restore-from-stronghold-router'

    interface FileWithPath extends File {
        path?: string
    }

    const allowedExtensions = ['stronghold']

    let importFile: ImportFile
    let importFileName = ''
    let importFilePath = ''
    let dropping = false

    let busy = false
    async function onContinueClick(): Promise<void> {
        busy = true
        validateBackupFile(importFileName)
        const _shouldMigrate = await shouldMigrate()
        updateOnboardingProfile({
            importFile,
            importFilePath,
            // TODO: we don't have a way to know the stronghold version of the backup file yet
            strongholdVersion: _shouldMigrate ? StrongholdVersion.V2 : STRONGHOLD_VERSION,
        })
        $restoreFromStrongholdRouter.next()
        busy = false
    }

    function onBackClick(): void {
        $restoreFromStrongholdRouter.previous()
    }

    function setFile(buffer?: ImportFile, file?: FileWithPath): void {
        if (!buffer) {
            file = null
            importFileName = null
            importFilePath = null
            return
        }

        importFile = buffer
        importFileName = file?.name
        importFilePath = file?.path
    }

    function onFileSelection(event: DragEvent | Event): void {
        event?.preventDefault()
        dropping = false

        const fileWithPath: FileWithPath =
            (event as DragEvent)?.dataTransfer?.files?.[0] ?? (event?.target as HTMLInputElement)?.files?.[0] ?? null

        if (!fileWithPath) {
            return setFile()
        }

        const ext = /\.([0-9a-z]+)$/i.exec(fileWithPath.name)
        if (!ext || !allowedExtensions.includes(ext[1])) {
            return setFile()
        }

        const reader = new FileReader()

        reader.onload = (e): void => {
            setFile(e.target.result, fileWithPath)
        }

        reader.readAsArrayBuffer(fileWithPath)
    }

    async function shouldMigrate(): Promise<boolean> {
        try {
            await restoreBackup(importFilePath, '', $onboardingProfile.network.protocol.bech32Hrp)
        } catch (err) {
            const isMigrationRequired = CLIENT_ERROR_REGEXES[ClientError.MigrationRequired].test(err?.error)
            return isMigrationRequired
        }
    }

    onMount(() => {
        updateOnboardingProfile({ importFile: undefined, importFilePath: undefined })
    })
</script>

<OnboardingLayout
    title={localize('views.onboarding.profileRecovery.importStrongholdBackup.title')}
    description={localize('views.onboarding.profileRecovery.importStrongholdBackup.body')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !importFile,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <div slot="content">
        <Dropzone
            fileName={importFileName}
            {allowedExtensions}
            onDrop={onFileSelection}
            bind:dropping
            extentionsLabel={localize('actions.importExtentions')}
        />
    </div>
</OnboardingLayout>
