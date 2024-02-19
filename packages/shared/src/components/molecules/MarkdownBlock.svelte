<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown'
    import LinkBlock from './markdown-renderers/LinkBlock.svelte'
    import ParagraphBlock from './markdown-renderers/ParagraphBlock.svelte'

    export let text: string

    const renderers = {
        heading: ParagraphBlock,
        paragraph: ParagraphBlock,
        image: ParagraphBlock,
        link: LinkBlock,
        em: ParagraphBlock,
        strong: ParagraphBlock,
        codespan: ParagraphBlock,
        del: ParagraphBlock,
        table: ParagraphBlock,
        tablehead: ParagraphBlock,
        tablebody: ParagraphBlock,
        tablerow: ParagraphBlock,
        tablecell: ParagraphBlock,
        list: ParagraphBlock,
        orderedlistitem: null,
        unorderedlistitem: null,
        listitem: ParagraphBlock,
        hr: ParagraphBlock,
        html: null,
        blockquote: ParagraphBlock,
        code: ParagraphBlock,
    }
</script>

<div class="markdown">
    <SvelteMarkdown source={text} {renderers} />
</div>

<style lang="postcss">
    :global(.markdown p),
    :global(.markdown p a) {
        @apply font-semibold text-sm;
    }
</style>
