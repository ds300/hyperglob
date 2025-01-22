<div alt style="text-align: center; transform: scale(.5);">
  <img alt="HYPERGLOB" src="https://github.com/ds300/hyperglob/raw/main/assets/hyperglob.svg" />
</div>

`hyperglob` is the fastest globbing library for node, bun, and deno.

<!--
- It's a no-brainer replacement for `fast-glob` and `globby`.
- It's an excellent alternative to `node-glob` in almost all situations. (see [Correctness](#correctness))
- It includes a robust `watch` mode so it improves on `chokidar` in situations where globbing is useful.
-->

## Installation

    npm install hyperglob

## Usage

```js
import { glob } from 'hyperglob'

const files = await glob('**/*.js', { cwd: 'src' })
```
