/**
 * Generates a unique choice name based on existing choices.
 * The function ensures that the generated name does not collide with 
 * any existing choice names in the provided `choices` object.
 * 
 * @param {Object} choices - An object containing existing choices.
 * @returns {string} - A unique choice name.
 */
export function generateChoiceName(choices) {
  let num = 1;
  let newName;
  
  do {
    newName = num === 1 ? "New Choice" : `"New Choice" (${num})`;
    num++;
  } while (Object.values(choices).some(choice => choice.choiceName === newName));
  
  return newName;
}
