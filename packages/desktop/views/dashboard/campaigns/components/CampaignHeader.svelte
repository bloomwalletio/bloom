<script lang="ts">
    import { buildUrl, truncateString } from '@core/utils'
    import { Button, IconName, Link, Text } from '@bloomwalletio/ui'
    import { ICampaign } from '@contexts/campaigns'
    import { openUrlInBrowser } from '@core/app'
    import { TIDE_BASE_URL, TideWebsiteEndpoint } from '@core/tide'
    import { Pane, NetworkAvatar } from '@ui'
    import { MediaPlaceholder } from '@ui/molecules'
    import CampaignParticipantsPill from './CampaignParticipantsPill.svelte'
    import CampaignRewardsPill from './CampaignRewardsPill.svelte'
    import CampaignStatusPill from './CampaignStatusPill.svelte'
    import CampaignTimestampPill from './CampaignTimestampPill.svelte'
    import sanitizeHtml from 'sanitize-html'
    import { NetworkNamespace } from '@core/network'
    import { localize } from '@core/i18n'
    import CampaignUsersPill from './CampaignUsersPill.svelte'

    export let campaign: ICampaign

    let imageLoadError = false

    $: description = getDescription(campaign.description)

    function getDescription(rawDescription: string): string {
        const sanitizedDescription = sanitizeHtml(rawDescription, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4'],
            transformTags: {
                a: 'x',
                b: 'x',
                i: 'x',
                em: 'x',
                strong: 'x',
                h1: 'p',
                h2: 'p',
                h3: 'p',
                h4: 'p',
            },
        })

        const concatenatedDescription = sanitizedDescription
            .replace(/<p>/g, '')
            .replace(/<\/p>/g, ' ')
            .replace(/<x>/g, '')
            .replace(/<\/x>/g, '')
        return concatenatedDescription
    }

    function onProjectClick(): void {
        const url = buildUrl({
            base: TIDE_BASE_URL,
            pathname: `${TideWebsiteEndpoint.Project}/${campaign.projectId}`,
        })
        openUrlInBrowser(url?.href)
    }

    function onCampaignClick(): void {
        const url = buildUrl({ base: TIDE_BASE_URL, pathname: `${TideWebsiteEndpoint.Campaign}/${campaign.id}` })
        openUrlInBrowser(url?.href)
    }
</script>

<Pane
    classes="
        w-full max-h-64 shrink-0 flex flex-row
        bg-surface dark:bg-surface-dark
        border border-solid border-stroke dark:border-stroke-dark
        divide-x divide-solid divide-stroke dark:divide-stroke-dark
        shadow-lg
    "
>
    {#if campaign.imageUrl && !imageLoadError}
        <div class="w-2/5 h-full p-4">
            <img
                src={campaign.imageUrl}
                alt={campaign?.title}
                class="w-full h-full object-cover rounded-lg"
                on:error={() => (imageLoadError = true)}
            />
        </div>
    {:else}
        <div class="w-2/5 h-full object-cover">
            <MediaPlaceholder size="md" />
        </div>
    {/if}
    <div
        class="w-full flex flex-col items-start justify-between divide-y divide-solid divide-stroke dark:divide-stroke-dark"
    >
        <div class="w-full flex flex-row justify-between items-center gap-4 py-4 px-5">
            <Text type="body1" class="whitespace-nowrap" truncate>{campaign.title}</Text>
            <div class="flex flex-row gap-3">
                <Button
                    size="xs"
                    icon={IconName.Send}
                    variant="outlined"
                    on:click={onProjectClick}
                    text={localize('views.campaigns.details.project')}
                />
                <Button
                    size="xs"
                    icon={IconName.Send}
                    on:click={onCampaignClick}
                    text={localize('views.campaigns.details.campaign')}
                />
            </div>
        </div>
        <div class="flex-grow w-full flex flex-col justify-between p-5 gap-2 overflow-hidden">
            <Text
                type="base"
                textColor="secondary"
                class="whitespace-pre-line overflow-hidden text-ellipsis line-clamp-3">{description}</Text
            >
            <div class="w-full flex flex-row justify-between gap-4">
                <div class="flex flex-row gap-2 items-center">
                    <NetworkAvatar size="xs" networkId={`${NetworkNamespace.Evm}:${campaign.chainId}`} />
                    <CampaignStatusPill {campaign} />
                    <CampaignTimestampPill {campaign} />
                    <CampaignUsersPill {campaign} />
                    <CampaignParticipantsPill {campaign} />
                    <CampaignRewardsPill {campaign} />
                </div>
                <Link href={campaign.url} text={truncateString(campaign.url, 30, 10)} external />
            </div>
        </div>
    </div>
</Pane>
