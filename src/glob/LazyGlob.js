import { Readable } from 'stream'
import { getRootDir, cwd as procCwd } from '../cwd.js'
import { resolve } from '../path.js'
import { compileMatcher } from './compile/compileMatcher.js'
import { LazyDir } from './fs/LazyDir.js'
import { matchInDir, matchInDirAsync, matchInDirStream } from './matchInDir.js'

export class LazyGlob {
  /** @type {LogicalClock} */
  #clock = { time: 0 }
  /** @type {Map<string, LazyDir>} */
  #rootDirs = new Map()

  /** @param {string} rootDir */
  #getRootDir(rootDir) {
    const existing = this.#rootDirs.get(rootDir)
    if (existing) return existing
    const dir = new LazyDir(this.#clock, rootDir, 0, false, false)
    this.#rootDirs.set(rootDir, dir)
    return dir
  }

  /**
   * @param {readonly string[]} patterns
   * @param {LazyGlobOptions} [opts]
   */
  sync(patterns, opts) {
    /** @type {LazyGlobOptions['cwd']} */
    const cwd = resolve('./', opts?.cwd ?? procCwd)
    const rootDir = getRootDir(cwd)
    /** @type {LazyGlobOptions['cache']} */
    const cache = opts?.cache ?? 'normal'

    /** @type {MatchOptions} */
    const matchOpts = {
      dot: opts?.dot ?? false,
      types: opts?.types ?? 'files',
      cwd,
      expandDirectories: opts?.expandDirectories ?? false,
      symbolicLinks: opts?.symbolicLinks ?? 'follow',
    }

    const matchers = compileMatcher(
      matchOpts,
      patterns.concat(opts?.ignore?.map((p) => '!' + p) ?? []),
      rootDir,
    )

    if (cache === 'normal') {
      this.#clock.time++
    }

    /**
     * @type {string[]}
     */
    const result = []
    matchInDir(
      cache === 'none'
        ? new LazyDir(this.#clock, rootDir, 0, false, true)
        : this.#getRootDir(rootDir),
      matchOpts,
      matchers,
      result,
    )

    return result
  }

  /**
   * @param {readonly string[]} patterns
   * @param {LazyGlobOptions} [opts]
   */
  async async(patterns, opts) {
    /** @type {LazyGlobOptions['cwd']} */
    const cwd = resolve('./', opts?.cwd ?? procCwd)
    const rootDir = getRootDir(cwd)
    /** @type {LazyGlobOptions['cache']} */
    const cache = opts?.cache ?? 'normal'

    /** @type {MatchOptions} */
    const matchOpts = {
      dot: opts?.dot ?? false,
      types: opts?.types ?? 'files',
      cwd,
      expandDirectories: opts?.expandDirectories ?? false,
      symbolicLinks: opts?.symbolicLinks ?? 'follow',
    }

    const matchers = compileMatcher(
      matchOpts,
      patterns.concat(opts?.ignore?.map((p) => '!' + p) ?? []),
      rootDir,
    )

    if (cache === 'normal') {
      this.#clock.time++
    }

    /**
     * @type {string[]}
     */
    const result = []
    await matchInDirAsync(
      cache === 'none'
        ? new LazyDir(this.#clock, rootDir, 0, false, true)
        : this.#getRootDir(rootDir),
      matchOpts,
      matchers,
      result,
    )

    return result
  }

  /**
   * @param {readonly string[]} patterns
   * @param {LazyGlobOptions} [opts]
   */
  stream(patterns, opts) {
    /** @type {LazyGlobOptions['cwd']} */
    const cwd = resolve('./', opts?.cwd ?? procCwd)
    const rootDir = getRootDir(cwd)
    /** @type {LazyGlobOptions['cache']} */
    const cache = opts?.cache ?? 'normal'

    /** @type {MatchOptions} */
    const matchOpts = {
      dot: opts?.dot ?? false,
      types: opts?.types ?? 'files',
      cwd,
      expandDirectories: opts?.expandDirectories ?? false,
      symbolicLinks: opts?.symbolicLinks ?? 'follow',
    }

    const matchers = compileMatcher(
      matchOpts,
      patterns.concat(opts?.ignore?.map((p) => '!' + p) ?? []),
      rootDir,
    )

    if (cache === 'normal') {
      this.#clock.time++
    }
    return Readable.from(
      matchInDirStream(
        cache === 'none'
          ? new LazyDir(this.#clock, rootDir, 0, false, true)
          : this.#getRootDir(rootDir),
        matchOpts,
        matchers,
      ),
    )
  }

  invalidate() {
    this.#clock.time++
  }
}
