<script lang="ts">
    export let variant: 'spread' | 'center'
</script>

<div class={variant}>
    <bg-gradient-container>
        <bg-gradient></bg-gradient>
        <bg-gradient></bg-gradient>
        <bg-gradient></bg-gradient>
    </bg-gradient-container>
</div>

<style lang="postcss">
    div {
        @apply absolute inset-0 flex items-center justify-center;
        @apply pointer-events-none;
    }

    bg-gradient-container {
        @apply dark:mix-blend-color-dodge;
        @apply blur-3xl;
    }

    bg-gradient {
        @apply block rounded-full;
    }

    .center {
        bg-gradient-container {
            @apply flex items-center justify-center;
            @apply opacity-40 dark:opacity-20;
            @apply rotate-[-60deg] scale-75;
            @apply ml-[9.375rem] mb-[3.125rem];
        }

        bg-gradient {
            @apply min-w-[37.5rem] min-h-[37.5rem] mix-blend-color opacity-50;
        }

        bg-gradient:nth-of-type(1) {
            @apply relative;
            @apply bg-[#89be9b] mr-[-46.875rem] mt-[-28.125rem];
        }

        bg-gradient:nth-of-type(2) {
            @apply bg-[#c395ff];
        }

        bg-gradient:nth-of-type(3) {
            @apply bg-[#72aaff] ml-[-18.75rem];
        }
    }

    .spread {
        bg-gradient-container {
            @apply opacity-40 dark:opacity-20;
        }

        bg-gradient:nth-of-type(1) {
            @apply absolute opacity-50;
            @apply rotate-[100deg];
            @apply min-w-[18.75rem] min-h-[18.75rem];
            @apply left-[-16rem] top-0 bottom-0;
            @apply mix-blend-color;
            background: conic-gradient(from 66deg at 51.51% 32.01%, #c395ff 70deg, #f4a5f6 286deg);
        }

        bg-gradient:nth-of-type(2) {
            @apply absolute opacity-50;
            @apply min-w-[18.75rem] min-h-[18.75rem];
            @apply bottom-[-8rem] right-[25rem];
            @apply mix-blend-color;
            background: conic-gradient(from 66deg at 51.51% 32.01%, #72aaff 70deg, #c395ff 178deg, #f4a5f6 286deg);
        }

        bg-gradient:nth-of-type(3) {
            @apply absolute opacity-50;
            @apply min-w-[18.75rem] min-h-[18.75rem];
            @apply top-[-4.5rem] right-[-2.5rem];
            @apply mix-blend-color;
            background: conic-gradient(from 66deg at 51.51% 32.01%, #72aaff 70deg, #c395ff 178deg, #f4a5f6 286deg);
        }
    }
</style>
