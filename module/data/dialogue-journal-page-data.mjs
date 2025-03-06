import MapField from "./fields/map-field.mjs";
import {generatedOptionId} from "../utils.mjs";

export default class DialogueJournalPageData extends foundry.abstract.TypeDataModel {
  /** @inheritDoc */
  static defineSchema() {
    const {JavaScriptField, SchemaField, StringField, BooleanField} = foundry.data.fields;
    return {
      options: new MapField(new SchemaField({
        text: new StringField({
          required: true,
          blank: true
        }),
        nextNodeId: new StringField({
          required: true,
          nullable: false
        }),
        command: new JavaScriptField({
          required: true, blank: true, async: true, label: "Command"
        }),
        valid: new BooleanField({
          required: true, initial: false
        }),
        used: new BooleanField({
          required: true, nullable: false, initial: false
        }),
        hidden: new BooleanField({
          required: true, nullable: false, initial: false
        }),
        answers: new MapField(new SchemaField({
          text: new StringField({required: true, blank: true})
        }), {
          initialKeysOnly: false,
          initialKeys: ["default"]
        })              
      }), {
        initialKeysOnly: false, initialKeys: [generatedOptionId(0)]
      }),
      endNode: new BooleanField({
        initial: true
      })
    };
  }
}
