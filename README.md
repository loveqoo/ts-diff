# ts-diff

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Definition

A JavaScript function to compare two objects (or values).

This function returns information of fields with different values (and diff type).

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save ts-diff
```

## How to use

```js
diff(1, 2) // MOD
diff({a:1}, {a:2, b:1}) // a: MOD, b: NEW
diff(1, undefined) // READY
``` 

## Diff Types

- NEW
- MOD
- DEL
- READY
