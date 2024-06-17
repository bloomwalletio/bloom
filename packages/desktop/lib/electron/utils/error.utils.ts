const IGNORED_ERROR_REGEXES: RegExp[] = [
    // Chromium network errors https://chromium.googlesource.com/chromium/src/+/refs/heads/main/net/base/net_error_list.h
    /^net::[A-Z0-9_]*/g,
    /.*neon::event::Channel::send*/,
    /.*No matching key*/,
]

export function shouldReportError(error: string): boolean {
    for (const regex of IGNORED_ERROR_REGEXES) {
        if (regex.test(error)) {
            return false
        }
    }
    return true
}
