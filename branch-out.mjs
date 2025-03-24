import {apps, data, hooks} from "./module/_module.mjs";
import CONSTANTS from "./module/constants.mjs";

Hooks.on("init", () => {
  foundry.utils.mergeObject(game.modules.get(CONSTANTS.MODULE_ID), {
    apps,
    data
  });

  CONFIG[CONSTANTS.MODULE_ID] = {
    apps,
    data,
    hooks
  };

  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    [`${CONSTANTS.MODULE_ID}.dialogue`]: data.DialogueJournalPageData
  });

  DocumentSheetConfig.registerSheet(JournalEntryPage, CONSTANTS.MODULE_ID, apps.JournalDialoguePageSheet, {
    label: "BRANCH_OUT.JournalDialoguePage",
    types: [`${CONSTANTS.MODULE_ID}.dialogue`]
  });
  
  foundry.utils.setProperty(ui, `${CONSTANTS.MODULE_ID}.dialoguePanel`, new apps.DialoguePanel());

});

Hooks.on("hoverToken", hooks.onHoverToken);
Hooks.on("renderTokenConfig", hooks.onRenderTokenConfig);
Hooks.on("preUpdateToken", hooks.preUpdateToken);
