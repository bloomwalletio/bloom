<script lang="ts">
    import { onMount, onDestroy } from 'svelte'

    export let density: number = 7
    export let maxParticleSize = 5
    export let minSpeed = 3
    export let maxSpeed = 7

    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D | null

    let particles: Particle[] = []
    let isCanvasReady: boolean = false

    function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function randomColor(): string {
        const colors = ['#A1D4AB', '#7C41C9', '#1D64F3']
        return colors[Math.floor(Math.random() * colors.length)]
    }

    class Particle {
        x: number
        y: number
        size: number
        speed: number
        color: string

        constructor() {
            if (!isCanvasReady) {
                throw new Error('Canvas is not ready!')
            }
            this.x = randomInt(0, canvas?.width || 0)
            this.y = randomInt(0, canvas?.height || 0)
            this.size = randomInt(1, maxParticleSize)
            this.speed = randomInt(minSpeed, maxSpeed) / 10
            this.color = randomColor()
        }

        update(): void {
            if (this.size > 0.2) this.size -= 0.1 * this.speed
        }

        draw(): void {
            if (!ctx) {
                return
            }
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
        ctx?.clearRect(0, 0, canvas?.width, canvas?.height)

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
        if (!ctx) {
            throw new Error('Context not found!')
        }

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

<canvas bind:this={canvas} class="absolute inset-0 pointer-events-none"></canvas>
