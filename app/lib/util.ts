
export function arrayShuffle<T>(array: Array<T>): Array<T> {
    if (!Array.isArray(array)) {
        throw new TypeError(`Expected an array, got ${typeof array}`);
    }

    for (let index = array.length - 1; index > 0; index--) {
        const newIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[newIndex]] = [array[newIndex], array[index]];
    }

    return array;
}

export function arrayToShuffled<T>(array: Array<T>): Array<T> {
    if (!Array.isArray(array)) {
        throw new TypeError(`Expected an array, got ${typeof array}`);
    }

    if (array.length === 0) {
        return [];
    }

    return arrayShuffle([...array]);
}
