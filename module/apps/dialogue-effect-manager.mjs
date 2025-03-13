import CONSTANTS from "../constants.mjs";
import Accordion from "./accordion.mjs";

const {ApplicationV2, HandlebarsApplicationMixin} = foundry.applications.api;

/**
 * @import { ApplicationConfiguration } from "../../foundry/resources/app/client-esm/applications/_types.mjs";
 * @import { ApplicationRenderOptions } from "../../foundry/resources/app/client-esm/applications/api/application.mjs";
 * @import {JournalEntryPage} from "../../foundry/resources/app/client-esm/database/database.mjs";
 */

/**
 * Represents a dialogue panel.
 * @alias DialogueEffectManager
 * @extends {ApplicationV2<ApplicationConfiguration,ApplicationRenderOptions>}
 * @mixes HandlebarsApplication
 */
export default class DialogueEffectManager extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options) {
    super(options);
    this.#dialogue = options.dialogue;
    this.#choiceKey = options.choiceKey;
  }
  /**@type {JournalEntryPage} */
  #dialogue;

  /**@type {string} */
  #choiceKey;

  get choiceKey() {
    return this.#choiceKey;
  }

  get dialogue() {
    return this.#dialogue;
  }

  get effects() {
    return this.dialogue.system.choices[this.choiceKey].effects;
  }

  /**
   * @override 
   * @type {ApplicationConfiguration & ApplicationRenderOptions}
   * */
  static DEFAULT_OPTIONS = {
    classes: ["branch-out", "dialogue-effect-manager"],
    tag: "form",
    window: {
      minimizable: true,
      resizable: true,
      icon: "fa-solid fa-atom-simple",
      title: "BRANCH_OUT.DIALOGUE_EFFECT_MANAGER.Title"
    },
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
      handler: DialogueEffectManager.#formHandler
    },
    actions: {
      createEffect: DialogueEffectManager._createEffect
    },
    position: {
      width: 500
    },
    accordions: [
      {
        headingSelector: ".effect-header",
        contentSelector: ".effect-content",
        startCollapsed: true,
        collapseOthers: false,
        direction: Accordion.DIRECTION.VERTICAL
      }
    ]
  };

  _accordions = this._createAccordions();

  /**
   * Instantiate accordion widgets.
   * @returns {Accordion[]}
   * @protected
   */
  _createAccordions() {
    if (Array.isArray(this.options.accordions)) return this.options.accordions.map((config) => new Accordion(config));
    else {
      console.error(
        "Branch Out | Error _createAccordions | this.options.accordions should be a Array"
      );
      return [];
    }
  }

  /**@inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);
    for (const accordion of this._accordions) {
      accordion._saveCollapsedState();
      accordion.bind(this.element);
    }
  }
  static PARTS = {
    panel: {
      template: `modules/${CONSTANTS.MODULE_ID}/templates/dialogue-effect-manager.hbs`
    }
  };
  
  async _prepareContext(options) {
    return {
      ...await super._prepareContext(options),
      effects: this.effects
    };
  }

  /**
   * A form submission handler method
   * @param {SubmitEvent} event 
   * @param {HTMLFormElement} form 
   * @param {FormDataExtended} formData 
   */
  static async #formHandler (event, form, formData) {
    console.log(formData);
    const submitData = {};
    foundry.utils.setProperty(submitData, `system.choices.${this.choiceKey}.effects`, formData.object);
    await this.dialogue.update(submitData, {render: false});
  }

  /**
   * Click action handler for creating a new effect
   * @param {PointerEvent} event - The originating click event
   * @param {HTMLElement} target - The capturing HTML element which defines the [data-action]
   */
  static async _createEffect(event, target) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.dialogue.update({
      [`system.choices.${this.choiceKey}.effects.${foundry.utils.randomID()}`]: {}
    }, {render: false});
    this.render();
  }
}
