import { genRandomInteger } from 'shared/src/common/utils'

const personList = [
    "einstein",
    "newton",
    "tesla",
    "kalam",
    "buddha",
    "mandela",
    "sachin",
    "teresa",
    "gandhi",
    "jobs",
    "edison",
    "disney",
    "darwin",
    "freud",
    "plato",
    "ford",
    "gates",
    "columbus"
]

export const getRandomUsername = (): string => {
    const personListIndex = genRandomInteger(0, personList.length)
    return personList[personListIndex] + "_" + genRandomInteger(10, 100)
}