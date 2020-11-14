"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe('diff test', () => {
    const wrappedDiff = (a, b) => {
        const result = src_1.diff(a, b);
        console.log(result);
        return result;
    };
    test('Diff value - number', () => {
        expect(wrappedDiff(1, 1).length).toEqual(0);
        expect(wrappedDiff(1, 2).length).toEqual(1);
        expect(wrappedDiff(1, undefined).length).toEqual(1);
        expect(wrappedDiff(1, null).length).toEqual(1);
        expect(wrappedDiff(1, '').length).toEqual(1);
        expect(wrappedDiff(1, true).length).toEqual(1);
        expect(wrappedDiff(1, []).length).toEqual(1);
        expect(wrappedDiff(1, {}).length).toEqual(1);
    });
    test('Diff value - string', () => {
        expect(wrappedDiff('a', 'a').length).toEqual(0);
        expect(wrappedDiff('a', 1).length).toEqual(1);
        expect(wrappedDiff('a', undefined).length).toEqual(1);
        expect(wrappedDiff('a', null).length).toEqual(1);
        expect(wrappedDiff('a', '').length).toEqual(1);
        expect(wrappedDiff('a', true).length).toEqual(1);
        expect(wrappedDiff('a', []).length).toEqual(1);
        expect(wrappedDiff('a', {}).length).toEqual(1);
    });
    test('Diff value - boolean', () => {
        expect(wrappedDiff(true, true).length).toEqual(0);
        expect(wrappedDiff(true, false).length).toEqual(1);
        expect(wrappedDiff(true, undefined).length).toEqual(1);
        expect(wrappedDiff(true, null).length).toEqual(1);
        expect(wrappedDiff(true, '').length).toEqual(1);
        expect(wrappedDiff(true, []).length).toEqual(1);
        expect(wrappedDiff(true, {}).length).toEqual(1);
    });
    test('Diff value - undefined', () => {
        expect(wrappedDiff(undefined, undefined).length).toEqual(0);
        expect(wrappedDiff(undefined, false).length).toEqual(1);
        expect(wrappedDiff(undefined, null).length).toEqual(1);
        expect(wrappedDiff(undefined, 1).length).toEqual(1);
        expect(wrappedDiff(undefined, '').length).toEqual(1);
        expect(wrappedDiff(undefined, []).length).toEqual(1);
        expect(wrappedDiff(undefined, {}).length).toEqual(1);
    });
    test('Diff value - null', () => {
        expect(wrappedDiff(null, null).length).toEqual(0);
        expect(wrappedDiff(null, false).length).toEqual(1);
        expect(wrappedDiff(null, undefined).length).toEqual(1);
        expect(wrappedDiff(null, 1).length).toEqual(1);
        expect(wrappedDiff(null, '').length).toEqual(1);
        expect(wrappedDiff(null, []).length).toEqual(1);
        expect(wrappedDiff(null, {}).length).toEqual(1);
    });
    test('Diff value - array', () => {
        expect(wrappedDiff([1, 2, 3], [1, 2, 3]).length).toEqual(0);
        expect(wrappedDiff([1, 2, 3], false).length).toEqual(1);
        expect(wrappedDiff([1, 2, 3], null).length).toEqual(1);
        expect(wrappedDiff([1, 2, 3], undefined).length).toEqual(1);
        expect(wrappedDiff([1, 2, 3], 1).length).toEqual(1);
        expect(wrappedDiff([1, 2, 3], '').length).toEqual(1);
        expect(wrappedDiff([1, 2, 3], []).length).toEqual(3);
        expect(wrappedDiff([1, 2, 3], {}).length).toEqual(1);
    });
    test('test warning!!', () => {
        expect(wrappedDiff(1, undefined).length).toEqual(1);
        expect(wrappedDiff('a', undefined).length).toEqual(1);
        expect(wrappedDiff(true, undefined).length).toEqual(1);
        expect(wrappedDiff(null, undefined).length).toEqual(1);
        expect(wrappedDiff([1, 2, 3], undefined).length).toEqual(1);
        expect(wrappedDiff(undefined, false).length).toEqual(1);
        expect(wrappedDiff({ a: 1, b: 'hello' }, { a: 1, b: null }).length).toEqual(1);
        expect(wrappedDiff({ a: 1, b: 'hello' }, { a: 1 }).length).toEqual(1);
        expect(wrappedDiff({ a: 1 }, { a: 1, b: 'hello' }).length).toEqual(1);
    });
    test('Diff value - object', () => {
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, { a: 1, b: 'hello', c: false })
            .length).toEqual(0);
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, { a: 2, b: 'bye', c: true })
            .length).toEqual(3);
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, false).length).toEqual(1);
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, null).length).toEqual(1);
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, undefined).length).toEqual(1);
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, 1).length).toEqual(1);
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, '').length).toEqual(1);
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, []).length).toEqual(1);
        expect(wrappedDiff({ a: 1, b: 'hello', c: false }, {}).length).toEqual(3);
        expect(wrappedDiff({ a: 1, b: 'hello' }, { a: 1 }).length).toEqual(1);
        expect(wrappedDiff({ a: 1 }, { a: 1, b: 'hello' }).length).toEqual(1);
    });
    test('Check Circular Reference', () => {
        const obj = { a: 1 };
        obj['b'] = obj; // circular ref
        expect(() => wrappedDiff(obj, {})).toThrow('Circular Reference Detected');
    });
});
//# sourceMappingURL=diff.test.js.map