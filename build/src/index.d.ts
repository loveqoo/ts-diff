/**
 * diff(1, 2) => MOD
 * diff(1, null) => DEL
 * diff(null, 1) => NEW
 * diff(1, undefined) => READY
 */
export declare const diff: (a: unknown, b: unknown, strictMode?: boolean) => PropertyDiff[];
export declare type PropertyDiff = {
    path: string;
    diffType: 'NEW' | 'MOD' | 'DEL' | 'READY';
    left: unknown;
    right: unknown;
};
