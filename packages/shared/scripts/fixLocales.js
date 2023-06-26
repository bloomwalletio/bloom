import * as fs from 'fs'
import * as path from 'path'

function fixLocales() {
    try {
        const localesDirectory = path.resolve('../locales')
        const filenames = fs.readdirSync(localesDirectory)
        filenames.forEach((filename) => {
            if (filename.slice(-5) === '.json') {
                const json = JSON.parse(fs.readFileSync(path.resolve(localesDirectory, filename)))
                const newJson = checkRecursive(json)
                fs.writeFileSync(path.resolve(localesDirectory, 'new', filename), JSON.stringify(newJson, null, 4))
            }
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

function checkRecursive(json) {
    const newJson = {}

    for (const key in json) {
        if (typeof json[key] === 'object' && json[key] !== null) {
            newJson[key] = checkRecursive(json[key])
        } else {
            return replaceFunction(json[key])
        }
    }

    return newJson
}

function replaceFunction(string) {
    return string.replace('Firefly', 'Bloom').replace('firefly', 'Bloom')
}

fixLocales()
