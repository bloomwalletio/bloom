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
        w-full shrink-0 grid grid-cols-3
        bg-surface dark:bg-surface-dark 
        border border-solid border-stroke dark:border-stroke-dark 
        divide-x divide-solid divide-stroke dark:divide-stroke-dark 
        shadow-lg
    "
>
    {#if campaign.imageUrl && !imageLoadError}
        <div class="p-4">
            <img
                src={campaign.imageUrl}
                alt={campaign?.title}
                class="w-full h-full object-cover rounded-lg"
                on:error={() => (imageLoadError = true)}
            />
        </div>
    {:else}
        <div class="min-w-full h-full object-cover">
            <MediaPlaceholder size="md" />
        </div>
    {/if}
    <div class="col-span-2 flex flex-col items-start divide-y divide-solid divide-stroke dark:divide-stroke-dark">
        <div class="w-full flex flex-row justify-between items-center py-4 px-5">
            <Text type="body1" classes="whitespace-nowrap">{campaign.title}</Text>
            <div class="flex flex-row gap-3">
                <Button
                    size="xs"
                    icon={IconName.Send}
                    variant="outlined"
                    on:click={onProjectClick}
                    text="Project Page"
                />
                <Button size="xs" icon={IconName.Send} on:click={onCampaignClick} text="Campaign" />
            </div>
        </div>
        <div class="h-full w-full flex flex-col items-start justify-between p-5 gap-4">
            <Text type="base" textColor="secondary">{@html description}</Text>
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
