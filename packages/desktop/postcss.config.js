import tailwind from 'tailwindcss'
import tailwindNesting from 'tailwindcss/nesting/index.js'
import tailwindConfig from '../shared/tailwind.config.js'
import autoprefixer from 'autoprefixer'

export default {
    plugins: [tailwindNesting, tailwind(tailwindConfig), autoprefixer],
}
