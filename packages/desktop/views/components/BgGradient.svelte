<div>
    <bg-gradient-container>
        <bg-gradient></bg-gradient>
        <bg-gradient></bg-gradient>
        <bg-gradient></bg-gradient>
    </bg-gradient-container>
</div>

<style lang="postcss">
    div {
        @apply absolute inset-0 flex items-center justify-center;
        @apply dark:mix-blend-color-dodge;
        @apply pointer-events-none;
    }

    bg-gradient-container {
        @apply flex items-center justify-center;
        @apply opacity-40 dark:opacity-20;
        transform: rotate(-60deg) scale(0.75);
        margin-left: 150px;
        margin-bottom: 50px;
        filter: blur(64px);
    }

    bg-gradient:nth-of-type(1) {
        display: block;
        min-width: 600px;
        min-height: 600px;
        border-radius: 9999px;
        background-color: #89be9b;
        margin-right: -750px;
        margin-top: -450px;
        position: relative;
        mix-blend-mode: color;
        opacity: 0.5;
    }

    bg-gradient:nth-of-type(2) {
        display: block;
        min-width: 600px;
        min-height: 600px;
        border-radius: 9999px;
        background-color: #c395ff;
        mix-blend-mode: color;
        opacity: 0.5;
    }

    bg-gradient:nth-of-type(3) {
        display: block;
        min-width: 600px;
        min-height: 600px;
        border-radius: 9999px;
        background-color: #72aaff;
        mix-blend-mode: color;
        margin-left: -300px;
        opacity: 0.5;
    }
</style>
