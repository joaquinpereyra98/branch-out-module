import {apps, data} from "./module/_module.mjs";
import CONSTANTS from "./module/constants.mjs";

Hooks.on("init", () => {
  foundry.utils.mergeObject(game.modules.get(CONSTANTS.MODULE_ID), {
    apps,
    data
  });

  CONFIG[CONSTANTS.MODULE_ID] = {
    apps,
    data
  };

  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    [`${CONSTANTS.MODULE_ID}.dialogue`]: data.DialogueJournalPageData
  });

  ui.dialoguePanel = new apps.DialoguePanel();

});
