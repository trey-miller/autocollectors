
export const createKey = (x: number, y: number, yMax: number): number => y + x * yMax;

/** 
 * return a copy of the 2d array with the value at (i, j) set to the new value
 * NOTE: i is the outer array's index, and j is the inner array. 
 */
export const set2dValue = <TValue>(values: TValue[][], i: number, j: number, newValue: TValue): TValue[][] => (
    values.map((row, ii) => ii === i
        ? row.map((value, jj) => jj === j ? newValue : value)
        : row)
);

export function parseIntWithDefault(value: string, defaultValue: number): number {
    const n = parseInt(value, 10);
    return isNaN(n) ? defaultValue : n;
}

/** returns undefined if there are no items in values, otherwise returns an element at a random index */
export const randomElement = <TValue>(values: TValue[]): TValue | undefined => {
    if (values.length === 0) {
        return undefined;
    }
    return values[Math.floor(Math.random() * values.length)]
}