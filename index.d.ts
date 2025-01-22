// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./src/glob/glob-types.d.ts" />

module 'hyperglob' {
  export const glob: {
    (patterns: string[], options?: LazyGlobOptions): Promise<string[]>
    sync(patterns: string[], options?: LazyGlobOptions): string[]
    stream(patterns: string[], options?: LazyGlobOptions): AsyncIterable<string>
  }
}
