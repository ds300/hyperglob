import { vol } from 'memfs'
import { testGlob, writeDir } from './glob-test-utils.js'
import { Dir } from './test-utils.js'

jest.mock('../src/fs.js', () => {
  return require('memfs')
})

beforeEach(() => {
  vol.reset()
})

describe('the "types" option', () => {
  const dir: Dir = {
    src: {
      utils: {
        'index.js': '->/lib/index.js',
      },
      test: '->/_test',
      'not_a_link.txt': 'ok',
    },
    lib: {
      'index.js': 'ok',
    },
    _test: {
      'thing.test.ts': 'ok',
    },
  }

  beforeEach(() => {
    writeDir('/', dir)
  })

  it('should follow symlinks by default', () => {
    const result = testGlob(['**'], {
      cwd: '/src',
    }).sort()

    expect(result).toMatchInlineSnapshot(`
      [
        "/src/not_a_link.txt",
        "/src/test/thing.test.ts",
        "/src/utils/index.js",
      ]
    `)
  })

  it('will ignore symlinks if told to', () => {
    const result = testGlob(['**'], {
      cwd: '/src',
      symbolicLinks: 'ignore',
    }).sort()

    expect(result).toMatchInlineSnapshot(`
      [
        "/src/not_a_link.txt",
      ]
    `)
  })

  it('will match symlinks but not traverse them if told to', () => {
    const filesResult = testGlob(['**'], {
      cwd: '/src',
      symbolicLinks: 'match',
    }).sort()

    expect(filesResult).toMatchInlineSnapshot(`
      [
        "/src/not_a_link.txt",
        "/src/utils/index.js",
      ]
    `)

    const dirsResult = testGlob(['**'], {
      cwd: '/src',
      symbolicLinks: 'match',
      types: 'dirs',
    }).sort()

    expect(dirsResult).toMatchInlineSnapshot(`
      [
        "/src/test",
        "/src/utils",
      ]
    `)
  })
})
