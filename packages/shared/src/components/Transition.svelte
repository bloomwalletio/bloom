<script lang="ts">
    import { scale } from 'svelte/transition'
</script>

<div
    data-label="transition"
    class=" w-full h-full bg-transparent"
    in:scale={{ duration: 380, start: 0.95, opacity: 0.9 }}
>
    <slot />
</div>
