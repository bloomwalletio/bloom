// performance-logger.ts
import { performance, PerformanceObserver } from 'perf_hooks'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const logFilePath = path.join(app.getPath('userData'), 'performance.log')

// Initialize performance observer
const obs = new PerformanceObserver((items) => {
    const entries = items.getEntries()
    const logData = entries.map((entry) => `${entry.name}: ${entry.duration}ms`).join('\n') + '\n'
    fs.appendFileSync(logFilePath, logData)
    performance.clearMarks()
})
obs.observe({ entryTypes: ['measure'], buffered: true })

// Function to log custom messages
export function logMessage(message: string): void {
    const logData = `${new Date().toISOString()} - ${message}\n`
    fs.appendFileSync(logFilePath, logData)
}

// Function to mark performance start
export function markStart(name: string): void {
    performance.mark(`${name}-start`)
}

// Function to mark performance end and measure
export function markEnd(name: string): void {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
}

// Initialize log file
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '')
}
