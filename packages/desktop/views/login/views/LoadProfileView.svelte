<script lang="ts">
    import { LoadingScreen } from '@ui'
    import { LOGIN_STEPS } from '@core/profile'
    import { loginProgress } from '@core/profile/stores'

    let progress = 0

    $: $loginProgress?.stepMessage, calculatePercentage()

    function calculatePercentage(): void {
        const currentStep = $loginProgress?.stepCount
        const totalSteps = Object.keys(LOGIN_STEPS).length
        const totalParts = (totalSteps * (totalSteps + 1)) / 2
        const percentageOfOnePart = 100 / totalParts
        const cumaltivePartsSoFar = (currentStep * (currentStep + 1)) / 2
        progress = Math.floor(percentageOfOnePart * cumaltivePartsSoFar)
    }
</script>

<LoadingScreen {progress} />
