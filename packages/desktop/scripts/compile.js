// Typescript support for Electron Builder still has some issues, so it is a workaround to transpile the TS config file before using it

import { execSync } from 'child_process'

// Get stage and OS flag from command line arguments
const stage = process.argv[2] ?? 'alpha'
const os = process.argv[3] ?? 'linux'
const arch = process.argv[4] ?? 'x64'

// Set environment variables
process.env.STAGE = stage

// Transpile TypeScript to JavaScript
try {
    execSync('tsc --esModuleInterop electron-builder-config.ts', { stdio: 'inherit' })

    // Build the command based on the stage and OS flag
    const command = `cross-env STAGE=${stage} electron-builder --${os} --${arch} --config electron-builder-config.js`

    // Run the electron-builder command
    execSync(command, { stdio: 'inherit' })
} catch (error) {
    console.error('Electron Builder transpilation or execution failed')
    process.exit(1)
}
