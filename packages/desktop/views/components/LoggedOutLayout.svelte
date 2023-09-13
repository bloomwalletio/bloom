<logged-out-layout class="flex flex-col justify-between items-center w-full h-full bg-slate-100 dark:bg-gray-900">
    <header class="w-full flex p-12 pb-6">
        <slot name="header" />
    </header>
    <slot name="content" />
    <footer class="flex flex-col w-full relative">
        <slot name="footer" />
    </footer>
</logged-out-layout>
