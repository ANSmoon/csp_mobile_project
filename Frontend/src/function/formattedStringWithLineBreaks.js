function formatStringWithLineBreaks(inputString, maxLength) {
    const words = inputString.split(' ')
    let formatted = ''
    let lineLength = 0
    let hasLineBreak = false

    for (const [index, word] of words.entries()) {
        if (index !== 0 && lineLength + word.length >= 15) {
            formatted += '...'
            break // 중간에 루프를 중단
        }

        if (
            index !== 0 &&
            !hasLineBreak &&
            lineLength + word.length >= maxLength
        ) {
            formatted += '\n' + word + ' '
            lineLength = word.length + 1
            hasLineBreak = true
        } else {
            formatted += word + ' '
            lineLength += word.length + 1
        }
    }

    return formatted
}

export default formatStringWithLineBreaks
