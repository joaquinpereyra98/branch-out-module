/**
 * Generates a dialogue option string in the format "dialogue-option-${num}",
 * where ${num} is a number padded with leading zeros to ensure it has a maximum
 * of three characters.
 *
 * @param {number} size - The number to be converted into a dialogue option string.
 *                        Must be between 0 and 999 (inclusive).
 * @throws {Error} - If the size is not a number or is outside the range of 0 to 999.
 * @returns {string} - The formatted dialogue option string.
 */
export function generatedChoicesId(size) {
  if ((typeof size !== "number") || (size < 0) || (size > 999)) {
    throw new Error("Size must be a number between 0 and 999.");
  }
    
  const paddedNum = String(size).padStart(3, "0");
  return `dialogueOption${paddedNum}`;
}

export function generateChoiceName(choices) {
  let num = 1;
  let newName;
  
  do {
    newName = num === 1 ? "New Choice" : `"New Choice" (${num})`;
    num++;
  } while (Object.values(choices).some(choice => choice.choiceName === newName));
  
  return newName;
}
