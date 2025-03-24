import CONSTANTS from "../constants.mjs";

/**
 * Updates token flags with a current dialogue UUID if the `DIALOGUE_ID` flag is changed.
 * 
 * @param {TokenDocument} tokenDocument - The original token document.
 * @param {Object} changed - The changes being applied to the token.
 */
export default function preUpdateToken(tokenDocument, changed) {

  const tokenFlags = foundry.utils.getProperty(tokenDocument, `flags.${CONSTANTS.MODULE_ID}`);
  const changedFlags = foundry.utils.getProperty(changed, `flags.${CONSTANTS.MODULE_ID}`);

  if (changedFlags[CONSTANTS.TOKEN_FLAGS.DIALOGUE_ID]) {
    const dialogueUuid = `JournalEntry.${changedFlags[CONSTANTS.TOKEN_FLAGS.JOURNAL_ENTRY_ID] ?? tokenFlags[CONSTANTS.TOKEN_FLAGS.JOURNAL_ENTRY_ID]}.JournalEntryPage.${changedFlags[CONSTANTS.TOKEN_FLAGS.DIALOGUE_ID]}`;
    foundry.utils.mergeObject(changedFlags, {
      [CONSTANTS.TOKEN_FLAGS.CURRENT_DIALOGUE]: {
        dialogueUuid,
        usedChoices: []
      }
    });
  }
}
