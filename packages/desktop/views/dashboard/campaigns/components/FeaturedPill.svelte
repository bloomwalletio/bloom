<script lang="ts">
    import { Icon, IconName, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
</script>

<Pill color="brand" compact opaque>
    <div class="flex flex-row space-x-1 items-center text-invert">
        <Icon size="xxs" customColor="text-invert" name={IconName.Star} />
        <div>
            {localize('general.featured')}
        </div>
    </div>
</Pill>
