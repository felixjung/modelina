import { GoRenderer } from '../GoRenderer';
import { FieldType, StructPreset } from '../GoPreset';

/**
 * Renderer for Go's `struct` type
 * 
 * @extends GoRenderer
 */
export class StructRenderer extends GoRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderFields(),
      await this.runAdditionalContentPreset()
    ];
    
    const formattedName = this.nameType(this.model.$id);
    const doc = this.renderComments(`${formattedName} represents a ${formattedName} model.`);
    
    return `${doc}
type ${formattedName} struct {
${this.indent(this.renderBlock(content, 2))}
}`;
  }
}

export const GO_DEFAULT_STRUCT_PRESET: StructPreset<StructRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  field({ fieldName, field, renderer, type, model }) {
    const formattedFieldName = renderer.nameField(fieldName, field);
    let fieldType = renderer.renderType(field);
    let tags = ` json:"${fieldName},omitempty"`;
    let pointer = model.isRequired(fieldName) ? '' : '*';

    if (
      type === FieldType.additionalProperty ||
      type === FieldType.patternProperties
    ) {
      fieldType = `map[string]${fieldType}`;
      tags = '';
      pointer = '';
    }

    return `${formattedFieldName} ${pointer}${fieldType}${tags}`;
  },
};
