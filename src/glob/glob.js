import { LazyGlob } from './LazyGlob.js'

const globInstance = new LazyGlob()

const sync = globInstance.sync.bind(globInstance)
const stream = globInstance.stream.bind(globInstance)
export const glob = Object.assign(globInstance.async.bind(globInstance), { sync, stream })
export default glob
