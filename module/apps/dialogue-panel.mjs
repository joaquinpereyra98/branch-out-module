import CONSTANTS from "../constants.mjs";
const {ApplicationV2, HandlebarsApplicationMixin} = foundry.applications.api;

/**
 * @import { ApplicationConfiguration } from "../../foundry/resources/app/client-esm/applications/_types.mjs";
 * @import { ApplicationRenderOptions } from "../../foundry/resources/app/client-esm/applications/api/application.mjs";
 */

/**
 * Represents a dialogue panel.
 * @alias DialoguePanel
 * @extends {ApplicationV2<ApplicationConfiguration,ApplicationRenderOptions>}
 * @mixes HandlebarsApplication
 */
export default class DialoguePanel extends HandlebarsApplicationMixin(
  ApplicationV2
) {
  /**
   * @type {ApplicationConfiguration & ApplicationRenderOptions}
  */
  static DEFAULT_OPTIONS = {
    classes: ["branch-out", "dialogue-panel-sheet"],
    tag: "div",
    window: {
      minimizable: false,
      resizable: false,
      frame: false,
      positioned: false
    },
    actions: {}
  };

  static PARTS = {
    panel: {
      template: `modules/${CONSTANTS.MODULE_ID}/templates/dialogue-panel.hbs`
    }
  };

  async _prepareContext(options) {
    return {
      ...await super._prepareContext(options)
    };
  }
}
