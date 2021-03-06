/**
 * diff(1, 2) => MOD
 * diff(1, null) => DEL
 * diff(null, 1) => NEW
 * diff(1, undefined) => READY
 */
export const diff = (a: unknown, b: unknown, strictMode = true) => {
  const typeGuards = {
    isArrayOrObject: (
      t: unknown,
      typeText: string
    ): t is Array<unknown> | {[index: string]: unknown} => {
      return typeText === 'array' || typeText === 'object';
    },
    isArray: (t: unknown): t is Array<unknown> => {
      return Array.isArray(t);
    },
    isObject: (
      t: unknown,
      typeString: string
    ): t is {[index: string]: unknown} => {
      return typeString === 'object';
    },
  };
  const isNullableType = (typeText: string) =>
    typeText === 'undefined' || typeText === 'null';
  const diffType = (aType: string, bType: string, reversed: boolean) => {
    if (isNullableType(aType)) {
      return reversed ? 'DEL' : 'NEW';
    }
    if (isNullableType(bType)) {
      return reversed ? 'NEW' : 'DEL';
    }
    return 'MOD';
  };
  const emptyDiffHold = () =>
    ({propertyDiffs: [], ref: new WeakMap<object, unknown>()} as DiffHold);
  const checkCircularRef = (
    weakMap: WeakMap<object, unknown>,
    target: object
  ) => {
    if (weakMap.has(target)) {
      throw Error('Circular Reference Detected');
    }
    return target;
  };
  const typesOf = (
    t1: unknown,
    t2: unknown
  ): [string, string, boolean, boolean] => {
    const v1 = typeOf(t1);
    const v2 = typeOf(t2);
    return [
      v1,
      v2,
      v1 === v2,
      v1 === v2 ? true : isNullableType(v1) && isNullableType(v2),
    ] as [string, string, boolean, boolean];
  };

  const isReady = (aType: string, bType: string, isReversed: boolean) =>
    (!isReversed && bType === 'undefined') ||
    (isReversed && aType === 'undefined');

  const diffInner = (
    a: unknown,
    b: unknown,
    reversed: boolean,
    hold: DiffHold,
    currentPath: Array<string> = [],
    isLeftFromObject = false
  ) => {
    if (a === b) {
      // finish
      return;
    }
    const [aType, bType, isSameType, isSameTypeIncludeNullable] = typesOf(a, b);
    if (isReady(aType, bType, reversed)) {
      typeGuards.isArrayOrObject(a, aType) && checkCircularRef(hold.ref, a);
      !reversed &&
        hold.propertyDiffs.push({
          path: currentPath.join('.'),
          diffType: 'READY',
          left: a,
          right: b,
        });
      return;
    }
    if (isSameType) {
      // Same type, Different value
      if (typeGuards.isArrayOrObject(a, aType)) {
        checkCircularRef(hold.ref, a);
        hold.ref.set(a, undefined);
        if (typeGuards.isArray(a) && typeGuards.isArray(b)) {
          if (a.length !== b.length) {
            !reversed &&
              hold.propertyDiffs.push({
                path: currentPath.join('.'),
                diffType: 'MOD',
                left: a,
                right: b,
              });
          } else {
            a.forEach((aValue, index) =>
              diffInner(
                aValue,
                b[index],
                reversed,
                hold,
                currentPath.concat([`[${index}]`]),
                false
              )
            );
          }
        } else if (
          typeGuards.isObject(a, aType) &&
          typeGuards.isObject(b, bType)
        ) {
          Object.keys(a)
            .filter(key => Object.prototype.hasOwnProperty.call(a, key))
            .forEach(key =>
              diffInner(
                a[key],
                b[key],
                reversed,
                hold,
                currentPath.concat([key]),
                true
              )
            );
        }
      } else {
        !reversed &&
          hold.propertyDiffs.push({
            path: currentPath.join('.'),
            diffType: 'MOD',
            left: a,
            right: b,
          });
      }
    } else {
      // Different type, Different value
      if (isSameTypeIncludeNullable) {
        // null, undefined 타입만 있을 때
        if (strictMode && !reversed) {
          hold.propertyDiffs.push({
            path: currentPath.join('.'),
            diffType: diffType(aType, bType, reversed),
            left: a,
            right: b,
          });
        }
      } else {
        typeGuards.isArrayOrObject(a, aType) && checkCircularRef(hold.ref, a);
        const type = diffType(aType, bType, reversed);
        if (isLeftFromObject) {
          if (type === 'NEW') {
            hold.propertyDiffs.push({
              path: currentPath.join('.'),
              diffType: type,
              left: a,
              right: b,
            });
          } else {
            !reversed &&
              hold.propertyDiffs.push({
                path: currentPath.join('.'),
                diffType: type,
                left: a,
                right: b,
              });
          }
        } else {
          if (!reversed) {
            hold.propertyDiffs.push({
              path: currentPath.join('.'),
              diffType: type,
              left: a,
              right: b,
            });
          }
        }
      }
    }
  };

  const holdNormal = emptyDiffHold();
  diffInner(a, b, false, holdNormal);
  const holdReverse = emptyDiffHold();
  diffInner(b, a, true, holdReverse);
  return holdNormal.propertyDiffs.concat(holdReverse.propertyDiffs);
};

const typeOf = (a: unknown) => {
  switch (typeof a) {
    case 'undefined':
      return 'undefined';
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'symbol':
      return 'string';
    case 'bigint':
      return 'bigint';
    case 'function':
      return 'function';
    default: {
      if (a === null) {
        return 'null';
      }
      if (Array.isArray(a)) {
        return 'array';
      }
      return 'object';
    }
  }
};

export type PropertyDiff = {
  path: string;
  diffType: 'NEW' | 'MOD' | 'DEL' | 'READY';
  left: unknown;
  right: unknown;
};

type DiffHold = {
  propertyDiffs: Array<PropertyDiff>;
  ref: WeakMap<object, unknown>;
};
