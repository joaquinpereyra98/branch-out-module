import CONSTANTS from "../constants.mjs";

function createSelectPageInput(entryId, config) {
  const pages = game.journal.get(entryId)?.pages.contents.filter(p => p.type === CONSTANTS.JOURNAL_ENTRY_PAGE_TYPE).sort((a, b) => a.sort - b.sort) ?? [];

  config.options = pages.map(page => ({
    label: page.name,
    value: page.id
  }));

  config.disabled = pages.length === 0;
  config.blank = "";
  return foundry.applications.fields.createSelectInput(config);
}

/**
 * 
 * @param {Application} app - The Application instance being rendered
 * @param {JQuery} $html - The inner HTML of the document that will be displayed and may be modified
 * @param {Object} data - The inner HTML of the document that will be displayed and may be modified
 */
export default function onRenderTokenConfig(app, [html], data) {
  if (!game.user.isGM) return;
  const form = html.querySelector("form");
  const navtab = form?.querySelector("nav.tabs");
  const footer = form?.querySelector("footer");
  if (!navtab || !footer) return;

  const tabData = "branch-out-dialogue";
  const tabLabel = game.i18n.localize("BRANCH_OUT.TOKEN_CONFIG.TABS.DIALOGUE");

  const aElement = document.createElement("a");
  aElement.className = "item"; 
  aElement.setAttribute("data-tab", tabData);
  aElement.innerHTML = `<i class='fa-solid fa-message-dots'></i> ${tabLabel}`;
  navtab.appendChild(aElement);

  const div = document.createElement("div"); 
  div.className = "tab";
  div.setAttribute("data-group", "main");
  div.setAttribute("data-tab", tabData);

  const tokenDocument = app.document;
  const {BooleanField, ForeignDocumentField} = foundry.data.fields;

  const haveDialogueField = new BooleanField({})
    .toFormGroup({
      label: "BRANCH_OUT.TOKEN_CONFIG.FIELDS.haveDialogue.Label",
      hint: "BRANCH_OUT.TOKEN_CONFIG.FIELDS.haveDialogue.Hint",
      localize: true
    }, {
      name: `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.TOKEN_FLAGS.HAVE_DIALOGUE}`,
      value: tokenDocument.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.TOKEN_FLAGS.HAVE_DIALOGUE) ?? false
    });

  const haveDialogueInput = haveDialogueField.querySelector("input[type='checkbox']");

  const journalEntryField = new ForeignDocumentField(foundry.documents.BaseJournalEntry, {
    idOnly: true
  })
    .toFormGroup({
      label: "BRANCH_OUT.TOKEN_CONFIG.FIELDS.JournalEntryField.Label",
      hint: "BRANCH_OUT.TOKEN_CONFIG.FIELDS.JournalEntryField.Hint",
      localize: true
    }, {
      name: `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.TOKEN_FLAGS.JOURNAL_ENTRY_ID}`,
      value: tokenDocument.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.TOKEN_FLAGS.JOURNAL_ENTRY_ID) ?? null
    });

  const journalEntryInput = journalEntryField.querySelector("select");

  const journalEntryPageField = new ForeignDocumentField(foundry.documents.BaseJournalEntryPage, {
    idOnly: true
  }).toFormGroup({
    label: "BRANCH_OUT.TOKEN_CONFIG.FIELDS.JournalEntryPageField.Label",
    hint: "BRANCH_OUT.TOKEN_CONFIG.FIELDS.JournalEntryPageField.Hint",
    localize: true
  }, {
    name: `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.TOKEN_FLAGS.DIALOGUE_ID}`,
    value: tokenDocument.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.TOKEN_FLAGS.DIALOGUE_ID) ?? null,
    input: (_, config) => {
      delete config.input;
      const entryId = journalEntryInput.value;
      return createSelectPageInput(entryId, config);
    }
  });
  const journalEntryPageInput = journalEntryPageField.querySelector("select");

  haveDialogueInput.addEventListener("change", (event) => {
    const checked = event.target.checked;
    journalEntryInput.disabled = !checked;
  });

  journalEntryInput.addEventListener("change", (event) => {
    const entryId = event.target.value;
    const newSelect = createSelectPageInput(entryId, {
      name: `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.TOKEN_FLAGS.DIALOGUE_ID}`,
      value: tokenDocument.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.TOKEN_FLAGS.DIALOGUE_ID) ?? null
    });
    journalEntryPageInput.replaceWith(newSelect);
  });

  div.append(haveDialogueField, journalEntryField, journalEntryPageField);
  form.insertBefore(div, footer);
}
