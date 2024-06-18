<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { errorLog } from '@core/error'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { setClipboard } from '@core/utils'
    import PopupTemplate from '../PopupTemplate.svelte'

    function onClearClick(): void {
        errorLog.set([])
        closePopup()
    }

    function onCopyClick(): void {
        const str = []

        for (const err of $errorLog) {
            str.push(new Date(err.time).toUTCString())
            str.push(`${err.type}: ${err.message}`)
            str.push('')
        }

        setClipboard(str.join('\r\n'))
    }
</script>

<PopupTemplate
    title={localize('popups.errorLog.title')}
    backButton={$errorLog.length > 0
        ? {
              text: localize('actions.clear'),
              onClick: onClearClick,
          }
        : undefined}
    continueButton={$errorLog.length > 0
        ? {
              text: localize('actions.copy'),
              onClick: onCopyClick,
          }
        : undefined}
>
    <div class="max-h-[50vh] md:max-h-[30vh] overflow-y-auto">
        {#if $errorLog.length > 0}
            {#each $errorLog as error}
                <div class="mb-7">
                    <Text textColor="secondary">{new Date(error.time).toUTCString()}</Text>
                    <Text class="break-words">
                        {error.type}:
                        {error.message}
                    </Text>
                </div>
            {/each}
        {:else}
            <Text textColor="secondary">{localize('popups.errorLog.empty')}</Text>
        {/if}
    </div>
</PopupTemplate>
