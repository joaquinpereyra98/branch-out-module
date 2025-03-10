import CONSTANTS from "../constants.mjs";
import {generatedChoicesId, generateChoiceName} from "../utils.mjs";

export default class JournalDialoguePageSheet extends JournalPageSheet {

  /** @inheritDoc */
  static get defaultOptions() {
    const options = foundry.utils.mergeObject(super.defaultOptions, {
      dragDrop: [{dropSelector: "form"}],
      submitOnChange: true,
      width: 700
    });
    options.classes.push("branch-out", "dialogue-journal");
    return options;
  }

  /*-------------------------------------------- */

  /** @inheritdoc */
  get template() {
    return `modules/${CONSTANTS.MODULE_ID}/templates/page-dialogue-${ this.isEditable ? "edit" : "view" }.hbs`;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async getData(options) {
    const context = super.getData(options);
    context.dialogue = {
      text: await this._prepareTextField(),
      nodeId: this.document._id,
      choicesField: await this._prepareChoicesField()
    };
    return context;
  }

  async _prepareTextField() {
    return {
      value: this.document.system.text,
      field: this.document.system.schema.getField("text"),
      enrich: await TextEditor.enrichHTML(
        this.document.system.text,
        {
          secrets: this.document.isOwner
        }
      )
    };
  }

  async _prepareChoicesField() {
    const {schema} = foundry.utils.deepClone(this.document.system);
    const choicesField = {};
    const choices = this.document.system.choices;
    for (const [key, choice] of Object.entries(choices)) {

      const getField = (path) => schema.getField(`choices.${key}.${path}`);
      const getName = (path) => `system.choices.${key}.${path}`;
      
      const choiceField = choicesField[key] = {};
  
      choiceField.state = {
        disabled: {
          value: choice.state.disabled,
          field: getField("state.disabled"),
          name: getName("state.disabled")
        },
        hidden: {
          value: choice.state.hidden,
          field: getField("state.hidden"),
          name: getName("state.hidden")
        }
      };
  
      choiceField.choiceName = {
        value: choice.choiceName,
        field: getField("choiceName"),
        name: getName("choiceName")
      };
  
      choiceField.nextNodeId = {
        value: choice.nextNodeId,
        field: getField("nextNodeId"),
        choices: this.#nextNodeChoices,
        name: getName("nextNodeId")
      };
  
      choiceField.condition = {
        value: choice.condition.value,
        field: getField("condition.value"),
        name: getName("condition.value"),
        command: {
          value: choice.condition.command,
          field: getField("condition.command"),
          name: getName("condition.command")
        }
      };

      choiceField.choiceText = {
        value: choice.choiceText,
        field: getField("choiceText"),
        name: getName("choiceText")
      };
    }

    return choicesField;
  }

  get #nextNodeChoices() {
    const pages = this.document.parent.pages.filter(p => (p.type === "branch-out.dialogue") && (p.id !== this.document.id));
    const pagesFilter = Object.fromEntries(pages.map(p => [p.id, p.name]));
    return {[this.document.id]: "Parent Dialogue", ...pagesFilter};
  }

  /* -------------------------------------------- */

  /** 
   * @inheritDoc
   * @param {JQuery} $html 
   *  */
  activateListeners($html) {
    super.activateListeners($html);
    const html = $html[0];
    const actionControls = html.querySelectorAll("[data-action]");
    actionControls.forEach(control => {
      control.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();
        const action = control.dataset.action;
        switch (action) {
          case "createChoice":
            await this._onCreateChoice(control);
            break;
        
          default:
            break;
        }
      });
    });
  }

  async _onCreateChoice(element) {
    const choices = this.document.system.choices;
    const newChoiceId = generatedChoicesId(Object.keys(choices).length);
    await this.document.update({
      [`system.choices.${newChoiceId}`]: {
        choiceName: generateChoiceName(choices)
      }
    });
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onDrop(event) {}
}
