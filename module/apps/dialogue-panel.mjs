import gsap from "/scripts/greensock/esm/all.js";
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

  /**@type {TokenDcoument} */
  _tokenDocument;

  _dialogue;

  _usedChoices;

  /**@inheritdoc */
  async _onFirstRender(context, options) {
    super._onFirstRender(context, options);
    const portraitContainer = this.element.querySelector(".portrait-container");
    const panelContainer = this.element.querySelector(".panel-container");

    gsap.timeline()
      .set(portraitContainer, {width: 0})
      .set(panelContainer, {width: 0})
      .to(panelContainer, {width: "auto", duration: 0.5, ease: "power2.out"})
      .to(portraitContainer, {width: "auto", duration: 1, ease: "power2.out"});

  }

  /**@inheritdoc */
  async _preClose(context, options) {
    const portraitContainer = this.element.querySelector(".portrait-container");
    const panelContainer = this.element.querySelector(".panel-container");

    await gsap.timeline()
      .to(portraitContainer, {width: 0, duration: 0.5, ease: "power2.out"})
      .to(panelContainer, {width: 0, duration: 1, ease: "power2.out"});

    super._preClose(context, options);
  }

  static PARTS = {
    portrait: {
      template: `modules/${CONSTANTS.MODULE_ID}/templates/dialogue-panel/dialogue-portrait.hbs`
    },
    container: {
      template: `modules/${CONSTANTS.MODULE_ID}/templates/dialogue-panel/panel-container.hbs`
    }
  };

  async _prepareContext(options) {
    return {
      ...await super._prepareContext(options),
      token: this._tokenDocument ?? "",
      portraitImg: this._preapreImgPortrait(),
      dialogueText: this._dialogue.system.text ?? ""
    };
  }

  _preapreImgPortrait() {
    return this._tokenDocument.actor ? this._tokenDocument.actor.img : this._tokenDocument.texture.src ?? "";
  }

  _prepareDialogueText() {

  }

  /**
   * 
   * @param {TokenDocument} token 
   */
  async bind(token) {
    this._tokenDocument = token;
    const currentDialogue = token.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.TOKEN_FLAGS.CURRENT_DIALOGUE);
    this._dialogue = fromUuidSync(currentDialogue.dialogueUuid);
    this._usedChoices = currentDialogue.usedChoices ?? [];

    await this.render({force: !this.rendered});
  }
}
