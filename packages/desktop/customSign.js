'use strict'

exports.default = async function (configuration) {
    if (configuration.path) {
        require('child_process').execSync(
            `smctl sign --fingerprint=${process.env.CERTIFICATE_FINGERPRINT} --input "${String(configuration.path)}"`
        )
    }
}
