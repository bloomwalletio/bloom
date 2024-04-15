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
                const milestoneTimestampSpent = detailedOutput.metadata.milestoneTimestampSpent as number
                updateAsyncDataByActivityId(account.index, activity.id, {
                    asyncStatus: StardustActivityAsyncStatus.Claimed,
                    claimedDate: new Date(milestoneTimestampSpent * MILLISECONDS_PER_SECOND),
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function isOutputClaimed(output: OutputData): boolean {
    const expirationDate = getExpirationDateFromOutput(output?.output as BasicOutput)

    const milestoneTimestampSpent = output.metadata.milestoneTimestampSpent
    if (expirationDate && milestoneTimestampSpent) {
        return output.isSpent && milestoneTimestampSpent * MILLISECONDS_PER_SECOND < expirationDate.getTime()
    } else {
        return output?.isSpent
    }
}
