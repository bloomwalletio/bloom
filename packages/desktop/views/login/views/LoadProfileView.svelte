<script lang="ts">
    import { localize } from '@core/i18n'
    import { LOGIN_STEPS } from '@core/profile'
    import { loginProgress } from '@core/profile/stores'
    import { LoadingScreen } from '@ui'

    let percent = 0

    $: statusMessage = $loginProgress?.stepMessage
        ? localize('views.loadProfile.loginSteps.' + $loginProgress?.stepMessage) + '...'
        : ''
    $: $loginProgress?.stepMessage, calculatePercentage()

    function calculatePercentage(): void {
        const currentStep = $loginProgress?.stepCount
        const totalSteps = Object.keys(LOGIN_STEPS).length
        const totalParts = (totalSteps * (totalSteps + 1)) / 2
        const percentageOfOnePart = 100 / totalParts
        const cumaltivePartsSoFar = (currentStep * (currentStep + 1)) / 2
        percent = percentageOfOnePart * cumaltivePartsSoFar
    }
</script>

<LoadingScreen showProgressBar {statusMessage} {percent} />
