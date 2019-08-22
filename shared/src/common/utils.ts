import { range } from 'lodash'

export const genRandomAlphaNumeric = (length: number, seed?: number): string => {
    const allowedCharArr = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B",
        "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
        "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ]
    return range(0, length).reduce<string>((res, num) => res + allowedCharArr[genRandomInteger(0, allowedCharArr.length, seed)], "")
}

export const genRandomInteger = (minValue: number, maxValue: number, seed?: number) => {
    if (maxValue - minValue < 0) {
        throw new Error(`Cannot generate a random number between ${minValue} and ${maxValue}`)
    }
    const randomValue = seed != null ? parseFloat('0.' + Math.sin(seed).toString().substr(6)) : Math.random()
    return Math.floor(randomValue * (maxValue - minValue)) + minValue
}