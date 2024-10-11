export function countCharacterOccurrences(text: string, character: string): number {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === character) {
            count++;
        }
    }
    return count;
}

