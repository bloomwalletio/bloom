'use strict'

export default {
    async function (configuration) {
        if (configuration.path) {
            await import('child_process').execSync(
                `smctl sign --fingerprint=${process.env.CERTIFICATE_FINGERPRINT} --input "${String(configuration.path)}"`
            )
        }
    }
}
