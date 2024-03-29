<script lang="ts">
    import { showNotification } from '@auxiliary/notification/actions'
    import { registeredProposalsForSelectedAccount, registerProposalsForAccounts } from '@contexts/governance'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { activeAccounts } from '@core/profile/stores'
    import { HEX_PREFIX } from '@core/utils'
    import { truncateString } from '@core/utils/string'
    import type { IAuth } from '@iota/sdk/out/types'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { NodeInput } from '@ui'
    import { Checkbox, TextInput } from '@bloomwalletio/ui'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { IError } from '@core/error'

    export let initialEventId: string | undefined
    export let initialNodeUrl: string | undefined

    let inputtedEventId = initialEventId
    let nodeUrl = initialNodeUrl
    let eventIdError: string
    let nodeInput: NodeInput
    let nodeInputError: string
    let isBusy = false
    let isRegisteringAllProposals = false
    let isAddingForAllAccounts = false

    $: isEditMode = !!initialEventId && !!initialNodeUrl
    $: disabled = isBusy || !nodeUrl || (!isRegisteringAllProposals && !eventId)
    $: eventId = inputtedEventId?.trim()

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            await Promise.all([
                !isRegisteringAllProposals && validateEventId(!isAddingForAllAccounts && !isEditMode),
                nodeInput?.validate(),
            ])
            await registerParticipationWrapper()
            updateActiveAccountPersistedData($selectedAccount?.index, {
                removedProposalIds: $selectedAccount?.removedProposalIds?.filter((id) => id !== inputtedEventId),
            })
            isBusy = false
        } catch (err) {
            isBusy = false
            const error = err as IError
            const isAuthenticationError = error?.error?.match(/(username)|(password)|(jwt)/g)
            const isEventError = error?.error?.match(/(the requested data)|(was not found)/)
            const isNodeError = error?.error?.match(/(failed to lookup address information)|(dns error)/)
            if (isAuthenticationError) {
                openNodeAuthRequiredPopup()
            } else if (isEventError) {
                showNotification({
                    variant: 'error',
                    text: localize('error.governance.unableToAddProposal.long', {
                        values: { proposalId: truncateString(eventId) },
                    }),
                })
            } else if (isNodeError) {
                showNotification({
                    variant: 'error',
                    text: localize('error.node.dns'),
                })
            } else if (!nodeInputError && !eventIdError) {
                handleError(error)
            }
        }
    }

    function openNodeAuthRequiredPopup(): void {
        openPopup({
            id: PopupId.NodeAuthRequired,
            props: { onSubmit: registerParticipationWrapper },
        })
    }

    async function registerParticipationWrapper(auth?: IAuth): Promise<void> {
        const options = {
            node: { url: nodeUrl, auth },
            eventsToRegister: isRegisteringAllProposals ? [] : [eventId],
            eventsToIgnore: [],
        }
        const accounts = isAddingForAllAccounts ? $activeAccounts : $selectedAccount ? [$selectedAccount] : []
        await registerProposalsForAccounts(options, accounts)
        showNotification({
            variant: 'success',
            text: generateSuccessMessage(),
        })
        closePopup()
    }

    function generateSuccessMessage(): string {
        if (isEditMode) {
            return localize('views.governance.proposals.successEdit')
        } else {
            return localize(`views.governance.proposals.${isAddingForAllAccounts ? 'successAddAll' : 'successAdd'}`, {
                values: { numberOfProposals: isRegisteringAllProposals ? 'other' : 'one' },
            })
        }
    }

    async function validateEventId(checkIfAlreadyRegistered: boolean): Promise<void> {
        const startsWith0x = eventId?.substring(0, 2) === HEX_PREFIX
        if (!startsWith0x) {
            eventIdError = localize('error.eventId.doesNotStartWith0x')
            return Promise.reject(eventIdError)
        }
        const hexLength = eventId?.substring(2)?.length
        const has64Length = hexLength === 64
        if (!has64Length) {
            eventIdError = localize('error.eventId.insufficientLength')
            return Promise.reject(eventIdError)
        }
        if (checkIfAlreadyRegistered && $registeredProposalsForSelectedAccount[eventId]) {
            eventIdError = localize('error.eventId.alreadyRegistered')
            return Promise.reject(eventIdError)
        }
    }
</script>

<PopupTemplate
    title={localize(`popups.${isEditMode ? 'editProposal' : 'addProposal'}.title`)}
    description={localize(`popups.${isEditMode ? 'editProposal' : 'addProposal'}.body`)}
    busy={isBusy}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        type: 'submit',
        form: 'add-proposal',
        text: localize('actions.confirm'),
        disabled,
    }}
>
    <form id="add-proposal" on:submit|preventDefault={onSubmit}>
        <div class="flex flex-col w-full space-y-4">
            <NodeInput bind:this={nodeInput} bind:nodeUrl bind:error={nodeInputError} />
            {#if !isEditMode}
                <Checkbox
                    label={localize('popups.addProposal.addAllProposalsOnNode')}
                    bind:checked={isRegisteringAllProposals}
                />
            {/if}
            <TextInput
                bind:value={inputtedEventId}
                bind:error={eventIdError}
                disabled={isRegisteringAllProposals || isEditMode}
                label={localize('views.governance.details.proposalInformation.eventId')}
            />
            {#if !isEditMode}
                <Checkbox
                    label={localize('popups.addProposal.addToAllAccounts')}
                    bind:checked={isAddingForAllAccounts}
                />
            {/if}
        </div>
    </form>
</PopupTemplate>
