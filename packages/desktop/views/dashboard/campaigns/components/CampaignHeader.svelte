<script lang="ts">
    import { Button, IconName, Link, Text } from '@bloomwalletio/ui'
    import { ICampaign } from '@contexts/campaigns'
    import { openUrlInBrowser } from '@core/app'
    import { TIDE_BASE_URL, TideWebsiteEndpoint } from '@core/tide'
    import Pane from '@ui/atoms/Pane.svelte'
    import { MediaPlaceholder } from '@ui/molecules'
    import CampaignParticipantsPill from './CampaignParticipantsPill.svelte'
    import CampaignRewardsPill from './CampaignRewardsPill.svelte'
    import CampaignStatusPill from './CampaignStatusPill.svelte'
    import CampaignTimestampPill from './CampaignTimestampPill.svelte'
    import sanitizeHtml from 'sanitize-html'
    import { localize } from '@core/i18n'

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
            .replace(/<\/p>/g, '\n')
            .replace(/<x>/g, '')
            .replace(/<\/x>/g, '')
        return concatenatedDescription
    }

    function onProjectClick(): void {
        openUrlInBrowser(`${TIDE_BASE_URL}/${TideWebsiteEndpoint.Project}/${campaign.projectId}`)
    }

    function onCampaignClick(): void {
        openUrlInBrowser(`${TIDE_BASE_URL}/${TideWebsiteEndpoint.Campaign}/${campaign.id}`)
    }
</script>

<Pane
    classes="
        w-full h-1/4 flex flex-row
        bg-surface dark:bg-surface-dark 
        border border-solid border-stroke dark:border-stroke-dark 
        divide-x divide-solid divide-stroke dark:divide-stroke-dark 
        shadow-lg
    "
>
    {#if campaign.imageUrl && !imageLoadError}
        <div class="w-1/3 h-full p-4">
            <img
                src={campaign.imageUrl}
                alt={campaign?.title}
                class="w-full h-full object-cover rounded-lg"
                on:error={() => (imageLoadError = true)}
            />
        </div>
    {:else}
        <div class="w-1/3 h-full object-cover">
            <MediaPlaceholder size="md" />
        </div>
    {/if}
    <div
        class="w-2/3 flex flex-col items-start justify-between divide-y divide-solid divide-stroke dark:divide-stroke-dark"
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
            <Text type="base" textColor="secondary" class="whitespace-pre-line">{@html description}</Text>
            <div class="w-full flex flex-row justify-between gap-4">
                <div class="flex flex-row gap-2">
                    <CampaignStatusPill {campaign} />
                    <CampaignTimestampPill {campaign} />
                    <CampaignParticipantsPill {campaign} />
                    <CampaignRewardsPill {campaign} />
                </div>
                <Link text={campaign.url} external on:click={() => openUrlInBrowser(campaign.url)} />
            </div>
        </div>
    </div>
</Pane>
