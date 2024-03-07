import { IAccountState } from '@core/account'
import { BasicOutput } from '@iota/sdk'
import { OutputData } from '@iota/sdk'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { get } from 'svelte/store'
import { StardustActivityAsyncStatus, ActivityDirection } from '../enums'
import { allAccountActivities, updateAsyncDataByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils/outputs'
import { NetworkNamespace } from '@core/network'
import { StardustActivity } from '../types/stardust'

export async function setOutgoingAsyncActivitiesToClaimed(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const activities = accountActivities.filter(
        (activity) =>
            activity.namespace === NetworkNamespace.Stardust &&
            activity.direction === ActivityDirection.Outgoing &&
            activity.asyncData
    ) as StardustActivity[]

    for (const activity of activities) {
        try {
            if (!activity.outputId) {
                continue
            }

            const detailedOutput = await account.getOutput(activity.outputId)
            const isClaimed = detailedOutput && isOutputClaimed(detailedOutput)
            if (isClaimed) {
                updateAsyncDataByActivityId(account.index, activity.id, {
                    asyncStatus: StardustActivityAsyncStatus.Claimed,
                    claimedDate: new Date(
                        (detailedOutput.metadata.milestoneTimestampSpent ?? 0) * MILLISECONDS_PER_SECOND
                    ),
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function isOutputClaimed(output: OutputData): boolean {
    const expirationDate = getExpirationDateFromOutput(output?.output as BasicOutput)

    if (expirationDate) {
        return (
            output.isSpent &&
            !!output.metadata.milestoneTimestampSpent &&
            output.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND < expirationDate.getTime()
        )
    } else {
        return output?.isSpent
    }
}
