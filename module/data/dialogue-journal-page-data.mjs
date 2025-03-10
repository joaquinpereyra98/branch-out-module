import MapField from "./fields/map-field.mjs";

export default class DialogueJournalPageData extends foundry.abstract.TypeDataModel {

  /** @inheritDoc */
  static LOCALIZATION_PREFIXES = ["JOURNALENTRYPAGE.BRANCH_OUT.Dialogue"];

  static LOCALIZATION_PREFIX_CHOICES = "JOURNALENTRYPAGE.BRANCH_OUT.Dialogue.CHOICES_FIELD";

  /** @inheritDoc */
  static defineSchema() {
    const {JavaScriptField, SchemaField, StringField, HTMLField, BooleanField} = foundry.data.fields;
    const document = this.parent;
    return {
      text: new HTMLField({required: true, blank: true}),
      choices: new MapField(new SchemaField({
        choiceName: new StringField({
          inital: "New Choice",
          label: `${this.LOCALIZATION_PREFIX_CHOICES}.choiceName.label`,
          hint: `${this.LOCALIZATION_PREFIX_CHOICES}.choiceName.hint`
        }),
        choiceText: new StringField({
          label: `${this.LOCALIZATION_PREFIX_CHOICES}.choiceText.label`,
          hint: `${this.LOCALIZATION_PREFIX_CHOICES}.choiceText.hint`
        }),
        nextNodeId: new StringField({
          required: true,
          blank: true,
          label: `${this.LOCALIZATION_PREFIX_CHOICES}.nextNodeId.label`,
          hint: `${this.LOCALIZATION_PREFIX_CHOICES}.nextNodeId.hint`
        }),
        condition: new SchemaField({
          value: new BooleanField({
            initial: false,
            label: `${this.LOCALIZATION_PREFIX_CHOICES}.condition.value.label`,
            hint: `${this.LOCALIZATION_PREFIX_CHOICES}.condition.value.hint`
          }),
          command: new JavaScriptField({
            required: true,
            blank: true,
            async: true,
            label: `${this.LOCALIZATION_PREFIX_CHOICES}.condition.command.label`,
            hint: `${this.LOCALIZATION_PREFIX_CHOICES}.condition.command.hint`
          })
        }),
        effects: new MapField(new SchemaField({
          command: new JavaScriptField({
            required: true,
            blank: true,
            async: true
          })
        }), {
          initialKeysOnly: false
        }),
        state: new SchemaField({
          hidden: new BooleanField({
            initial: false,
            label: `${this.LOCALIZATION_PREFIX_CHOICES}.states.hidden.label`,
            hint: `${this.LOCALIZATION_PREFIX_CHOICES}.states.hidden.hint`
          }),
          disabled: new BooleanField({
            initial: false,
            label: `${this.LOCALIZATION_PREFIX_CHOICES}.states.disabled.label`,
            hint: `${this.LOCALIZATION_PREFIX_CHOICES}.states.disabled.hint`
          })
        })
      }), {
        initialKeysOnly: false
      })
    };
  }
}
