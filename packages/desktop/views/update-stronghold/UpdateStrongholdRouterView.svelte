<script lang="ts">
    import { UpdateStrongholdRoute } from './update-stronghold-route.enum'
    import { updateStrongholdRoute } from './update-stronghold-router'
    import { ChangePasswordView, UpdateBackupView, UpdateStrongholdView } from './views'

    export let isRecovery = false

    let password: string = ''
    let newPassword: string = ''
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.Update}
    <UpdateStrongholdView bind:password {isRecovery} />
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.ChangePassword}
    <ChangePasswordView bind:newPassword oldPassword={password} {isRecovery} />
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.SaveBackup}
    <UpdateBackupView changedPassword={!!newPassword} {isRecovery} password={newPassword || password} />
{/if}
