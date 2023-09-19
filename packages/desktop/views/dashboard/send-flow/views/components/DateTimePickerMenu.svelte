<script lang="ts">
    import { formatDate, localize } from '@core/i18n'
    import { Text } from '@ui'
    import { showNotification } from '@auxiliary/notification'
    import { DateTimePicker, IconName, Menu } from '@bloomwalletio/ui'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE, TimePeriod, isFutureDateTime } from '@core/utils'

    export let value: Date
    export let selected: TimePeriod = TimePeriod.None
    export let disabled: boolean = false

    const DATE_NOW = Date.now()

    let previouslySelected = selected
    let customDate = new Date(Date.now() + 5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)

    let menu: Menu | undefined = undefined
    let dateTimePicker: DateTimePicker | undefined = undefined
    let anchor: HTMLElement | undefined = undefined

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
            dateTimePicker?.open()
        } else {
            customDate = undefined
        }
        menu?.close()
        previouslySelected = selected
        selected = _selected
        setDate()
    }

    function onCancelClick(): void {
        if (!customDate) {
            selected = previouslySelected
            setDate()
        }
        dateTimePicker?.close()
    }

    function onConfirmClick(): void {
        if (isFutureDateTime(customDate)) {
            value = customDate
            dateTimePicker?.close()
        } else {
            showNotification({
                variant: 'warning',
                text: localize('warning.transaction.invalidDateTime'),
            })
        }
    }
</script>

<Menu
    bind:this={menu}
    compact={false}
    placement="top-end"
    button={{
        text: localize('actions.remove'),
        onClick: () => onChooseTimeClick(TimePeriod.None),
    }}
    items={[
        {
            icon: IconName.ClockPlus,
            title: localize('menus.dateTimePicker.1hour'),
            subtitle: formatDate(dateIn1Hour, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            }),
            selected: selected === TimePeriod.OneHour,
            onClick: () => onChooseTimeClick(TimePeriod.OneHour),
        },
        {
            icon: IconName.CalendarDate,
            title: localize('menus.dateTimePicker.1day'),
            subtitle: formatDate(dateIn1Day, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            }),
            selected: selected === TimePeriod.OneDay,
            onClick: () => onChooseTimeClick(TimePeriod.OneDay),
        },
        {
            icon: IconName.CalendarPlus,
            title: localize('menus.dateTimePicker.1week'),
            subtitle: formatDate(dateIn1Week, {
                dateStyle: 'medium',
                timeStyle: 'medium',
            }),
            selected: selected === TimePeriod.OneWeek,
            onClick: () => onChooseTimeClick(TimePeriod.OneWeek),
        },
        {
            icon: IconName.Calendar,
            title: localize('menus.dateTimePicker.customDate.title'),
            subtitle: customDate
                ? formatDate(customDate, { dateStyle: 'medium', timeStyle: 'medium' })
                : localize('menus.dateTimePicker.customDate.subtitle'),
            selected: selected === TimePeriod.Custom,
            onClick: () => onChooseTimeClick(TimePeriod.Custom),
        },
    ]}
>
    <button
        bind:this={anchor}
        slot="anchor"
        class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}"
        {disabled}
    >
        <div class="flex flex-row hover:text-blue-600 items-center">
            <Text
                highlighted={!disabled}
                color="gray-600"
                darkColor="gray-500"
                classes={disabled ? '' : 'hover:text-blue-600'}
            >
                {value ? formatDate(value, { dateStyle: 'long', timeStyle: 'medium' }) : localize('general.none')}
            </Text>
        </div>
    </button>
</Menu>
<DateTimePicker
    bind:this={dateTimePicker}
    bind:value={customDate}
    {anchor}
    on:cancel={onCancelClick}
    on:confirm={onConfirmClick}
    startDate={new Date()}
/>
