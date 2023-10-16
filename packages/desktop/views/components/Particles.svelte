<script lang="ts">
    import { onMount, onDestroy } from 'svelte'

    export let density: number = 4
    export let speed: number = 0.5

    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D

    let particles: Particle[] = []
    let isCanvasReady: boolean = false

    class Particle {
        x: number
        y: number
        size: number
        color: string

        constructor() {
            if (!isCanvasReady) return

            this.x =
                Math.random() < 0.5
                    ? Math.random() * ((canvas?.width || 0) / 3)
                    : (2 * (canvas?.width || 0)) / 3 + Math.random() * ((canvas?.width || 0) / 3)
            this.y = Math.random() * (canvas?.height || 0)
            this.size = Math.random() * 4 + 1
            this.color = this.generateColor()
        }

        generateColor(): string {
            const hue = Math.random() < 0.5 ? 250 : 240
            const saturation = Math.random() * 30 + 40
            const lightness = Math.random() * 10 + 60
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`
        }

        update(): void {
            if (this.size > 0.2) this.size -= 0.1 * speed
        }

        draw(): void {
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
        }
    }

    function init(): void {
        particles = []
        for (let i = 0; i < density; i++) {
            particles.push(new Particle())
        }
    }

    function animate(): void {
        ctx.clearRect(0, 0, canvas?.width, canvas?.height)

        for (let i = 0; i < particles.length; i++) {
            particles[i].update()
            particles[i].draw()

            if (particles[i].size <= 0.2) {
                particles.splice(i, 1)
                i--
                particles.push(new Particle())
            }
        }

        requestAnimationFrame(animate)
    }

    function handleResize(): void {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
    }

    onMount(() => {
        ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Context not found!')

        window.addEventListener('resize', handleResize)

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        isCanvasReady = true
        init()
        animate()
    })

    onDestroy(() => {
        window.removeEventListener('resize', handleResize)
    })
</script>

<canvas bind:this={canvas} class="absolute inset-0"></canvas>
