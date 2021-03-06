import { SyncObject } from '@udonarium/core/synchronize-object/decorator';

import { DataElement } from '@udonarium/data-element';
import { GameCharacter } from '@udonarium/game-character';
import { ChatPalette } from '@udonarium/chat-palette';
import { StringUtil } from '@udonarium/core/system/util/string-util';

@SyncObject('custom-character')
export class CustomCharacter extends GameCharacter {
  static createCustomCharacter(
    name: string,
    size: number,
    imageIdentifier: string
  ): CustomCharacter {
    const gameCharacter: CustomCharacter = new CustomCharacter();
    gameCharacter.createDataElements();
    gameCharacter.initialize();

    gameCharacter.commonDataElement.appendChild(
      DataElement.create('name', name, {})
    );
    gameCharacter.commonDataElement.appendChild(
      DataElement.create('size', size, {})
    );
    if (
      gameCharacter.imageDataElement.getFirstElementByName('imageIdentifier')
    ) {
      gameCharacter.imageDataElement.getFirstElementByName(
        'imageIdentifier'
      ).value = imageIdentifier;
      gameCharacter.imageDataElement
        .getFirstElementByName('imageIdentifier')
        .update();
    }

    return gameCharacter;
  }

  toXml(): string {
    return super.toXml().replace(/custom-character/g, 'character');
  }

  createParentElement(name: string, parentElement?: DataElement): DataElement {
    const element = Utils.createDataElement(name, '');
    if (parentElement) {
      parentElement.appendChild(element);
    } else {
      this.detailDataElement.appendChild(element);
    }
    return element;
  }
}

export class Utils {
  static createDataElement(name: string, value: string | number): DataElement {
    name = StringUtil.toHalfWidth(name);
    return DataElement.create(name, value, {});
  }

  static createResourceElement(
    name: string,
    value: string | number,
    currentValue: string | number
  ): DataElement {
    name = StringUtil.toHalfWidth(name);
    return DataElement.create(name, value, {
      type: 'numberResource',
      currentValue: currentValue,
    });
  }

  static createNoteElement(name: string, value: string | number): DataElement {
    name = StringUtil.toHalfWidth(name);
    return DataElement.create(name, value, { type: 'note' });
  }

  static formatModifier(value: number): string {
    if (value < 0) return value.toString();
    if (value > 0) return `+${value}`;
    return '';
  }

  static createChatPalette(gameSystem: string): ChatPalette {
    const palette: ChatPalette = new ChatPalette();
    palette.dicebot = gameSystem;
    return palette;
  }
}
