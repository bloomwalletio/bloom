<script lang="ts">
    import { formatDate, localize } from '@core/i18n'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE, TimePeriod, isFutureDateTime } from '@core/utils'
    import { Modal, MenuItem } from '@ui'
    import { DateTimePicker } from '@bloomwalletio/ui'
    import { fade } from 'svelte/transition'
    import { showNotification } from '@auxiliary/notification'

    export let value: Date
    export let selected: TimePeriod = TimePeriod.None

    export function tryOpen(): void {
        if (!canShowDateTimePicker) {
            modal?.open()
        } else {
            canShowDateTimePicker = !canShowDateTimePicker
        }
    }

    const DATE_NOW = Date.now()

    let previouslySelected = selected
    let customDate = new Date(Date.now() + 5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    let canShowDateTimePicker = false
    let modal: Modal

    const dateIn1Hour = new Date(DATE_NOW)
    dateIn1Hour.setTime(dateIn1Hour.getTime() + 1 * 60 * 60 * 1000)

    const dateIn1Day = new Date(DATE_NOW)
    dateIn1Day.setDate(dateIn1Day.getDate() + 1)

    const dateIn1Week = new Date(DATE_NOW)
    dateIn1Week.setDate(dateIn1Week.getDate() + 7)

    setDate()
    function setDate(): void {
        switch (selected) {
            case TimePeriod.OneHour:
                value = dateIn1Hour
                break
            case TimePeriod.OneDay:
                value = dateIn1Day
                break
            case TimePeriod.OneWeek:
                value = dateIn1Week
                break
            case TimePeriod.None:
                value = null
                break
            case TimePeriod.Custom:
            default:
                break
        }
    }

    function onChooseTimeClick(_selected: TimePeriod): void {
        if (_selected === TimePeriod.Custom) {
            canShowDateTimePicker = !canShowDateTimePicker
        } else {
            customDate = undefined
        }
        modal?.close()
        previouslySelected = selected
        selected = _selected
        setDate()
    }

    function onCancelClick(): void {
        if (!customDate) {
            selected = previouslySelected
            setDate()
        }
        canShowDateTimePicker = false
    }

    function onConfirmClick(): void {
        if (isFutureDateTime(value)) {
            value = customDate
            canShowDateTimePicker = false
        } else {
            showNotification({
                variant: 'warning',
                text: localize('warning.transaction.invalidDateTime'),
            })
        }
    }
</script>

<Modal bind:this={modal} position={{ bottom: '120px', left: '400px' }} size="medium">
    <date-time-picker-modal class="flex flex-col space-y-0 whitespace-nowrap" in:fade={{ duration: 100 }}>
        <MenuItem
            icon="calendar"
            title={localize('general.none')}
            onClick={() => onChooseTimeClick(TimePeriod.None)}
            selected={selected === TimePeriod.None}
        />
        <hr />
        <MenuItem
            icon="calendar"
            title={localize('menus.dateTimePicker.1hour')}
            subtitle={formatDate(dateIn1Hour, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            })}
            onClick={() => onChooseTimeClick(TimePeriod.OneHour)}
            selected={selected === TimePeriod.OneHour}
        />
        <MenuItem
            icon="calendar"
            title={localize('menus.dateTimePicker.1day')}
            subtitle={formatDate(dateIn1Day, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            })}
            onClick={() => onChooseTimeClick(TimePeriod.OneDay)}
            selected={selected === TimePeriod.OneDay}
        />
        <MenuItem
            icon="calendar"
            title={localize('menus.dateTimePicker.1week')}
            subtitle={formatDate(dateIn1Week, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            })}
            onClick={() => onChooseTimeClick(TimePeriod.OneWeek)}
            selected={selected === TimePeriod.OneWeek}
        />
        <hr />
        <MenuItem
            icon="calendar"
            title={localize('menus.dateTimePicker.customDate.title')}
            subtitle={customDate
                ? formatDate(customDate, { dateStyle: 'medium', timeStyle: 'medium' })
                : localize('menus.dateTimePicker.customDate.subtitle')}
            onClick={() => onChooseTimeClick(TimePeriod.Custom)}
            selected={selected === TimePeriod.Custom}
        />
    </date-time-picker-modal>
</Modal>
{#if canShowDateTimePicker}
    <DateTimePicker
        bind:value={customDate}
        on:cancel={onCancelClick}
        on:confirm={onConfirmClick}
        startDate={new Date()}
    />
{/if}
