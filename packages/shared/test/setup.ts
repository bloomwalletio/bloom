/**
 * NOTE: This file is before creating additional setup for the testing
 * environment as needed (e.g. a particular object must be mocked or is mocked
 * everywhere).
 */
import './mocks/api.mock'
import './mocks/match-media.mock'
import './mocks/platform.mock'
import { TextEncoder, TextDecoder } from 'util'

// This is necessarcy to polyfil these features into the jest environment
Object.assign(global, { TextDecoder, TextEncoder })

beforeAll(async () => {})
afterAll(async () => {})
