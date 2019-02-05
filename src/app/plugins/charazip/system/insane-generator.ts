import { ChatPalette } from '@udonarium/chat-palette';
import { DataElement } from '@udonarium/data-element';

import { CustomCharacter } from '../custom-character';

/**
 * キャラクターシート倉庫 インセイン
 * https://character-sheets.appspot.com/insane/
 */
export class InsaneGenerator {
  static geneateByAppspot(
    json: any,
    url: string,
    imageIdentifier: string
  ): CustomCharacter[] {
    const gameCharacter: CustomCharacter = CustomCharacter.createCustomCharacter();

    /*
     * common
     */
    const nameElement = DataElement.create(
      'name',
      json.base.name,
      {},
      'name_' + gameCharacter.identifier
    );
    const sizeElement = DataElement.create(
      'size',
      1,
      {},
      'size_' + gameCharacter.identifier
    );
    gameCharacter.commonDataElement.appendChild(nameElement);
    gameCharacter.commonDataElement.appendChild(sizeElement);

    if (
      gameCharacter.imageDataElement.getFirstElementByName('imageIdentifier')
    ) {
      gameCharacter.imageDataElement.getFirstElementByName(
        'imageIdentifier'
      ).value = imageIdentifier || '';
      gameCharacter.imageDataElement
        .getFirstElementByName('imageIdentifier')
        .update();
    }

    /*
     * ステータス
     */
    const statusElement = DataElement.create(
      'ステータス',
      '',
      {},
      'ステータス' + gameCharacter.identifier
    );
    gameCharacter.detailDataElement.appendChild(statusElement);

    statusElement.appendChild(
      DataElement.create(
        '生命力',
        json.hitpoint.max,
        { type: 'numberResource', currentValue: json.hitpoint.value },
        '生命力' + gameCharacter.identifier
      )
    );
    statusElement.appendChild(
      DataElement.create(
        '正気度',
        json.sanepoint.max,
        { type: 'numberResource', currentValue: json.sanepoint.value },
        '正気度' + gameCharacter.identifier
      )
    );
    const curiosities = {
      a: '暴力',
      ab: '情動',
      bc: '知覚',
      cd: '技術',
      de: '知識',
      e: '怪異'
    };
    statusElement.appendChild(
      DataElement.create(
        '好奇心',
        curiosities[json.base.curiosity],
        {},
        '好奇心' + gameCharacter.identifier
      )
    );
    statusElement.appendChild(
      DataElement.create(
        '恐怖心',
        json.base.nightmare,
        {},
        '恐怖心' + gameCharacter.identifier
      )
    );

    /*
     * 情報
     */
    const infoElement = DataElement.create(
      '情報',
      '',
      {},
      '情報' + gameCharacter.identifier
    );
    gameCharacter.detailDataElement.appendChild(infoElement);
    infoElement.appendChild(
      DataElement.create(
        'PL名',
        json.base.player || '',
        {},
        'PL名_' + gameCharacter.identifier
      )
    );
    infoElement.appendChild(
      DataElement.create(
        'HO',
        json.scenario.pcno ? `PC${json.scenario.pcno}` : '',
        {},
        'HO_' + gameCharacter.identifier
      )
    );
    infoElement.appendChild(
      DataElement.create(
        '説明',
        json.base.memo,
        { type: 'note' },
        '説明' + gameCharacter.identifier
      )
    );
    infoElement.appendChild(
      DataElement.create(
        'URL',
        url,
        { type: 'note' },
        'URL_' + gameCharacter.identifier
      )
    );

    /*
     * 特技
     */
    const skillElement = DataElement.create(
      '特技',
      '',
      {},
      '特技' + gameCharacter.identifier
    );
    gameCharacter.detailDataElement.appendChild(skillElement);
    const skillNameList = [
      ['焼却', '恋', '痛み', '分解', '物理学', '時間'],
      ['拷問', '悦び', '官能', '電子機器', '数学', '混沌'],
      ['緊縛', '憂い', '手触り', '整理', '化学', '深海'],
      ['脅す', '恥じらい', 'におい', '薬品', '生物学', '死'],
      ['破壊', '笑い', '味', '効率', '医学', '霊魂'],
      ['殴打', '我慢', '物音', 'メディア', '教養', '魔術'],
      ['切断', '驚き', '情景', 'カメラ', '人類学', '暗黒'],
      ['刺す', '怒り', '追跡', '乗物', '歴史', '終末'],
      ['射撃', '恨み', '芸術', '機械', '民俗学', '夢'],
      ['戦争', '哀しみ', '第六感', '罠', '考古学', '地底'],
      ['埋葬', '愛', '物陰', '兵器', '天文学', '宇宙']
    ];
    let skillCount = 0;
    for (const skill of json.learned) {
      if (!skill.id) {
        continue;
      }
      skillCount++;
      // skill.idは skills.row8.name2 のような値を持っている
      const matchData = skill.id.match(/^skills\.row(\d+)\.name(\d+)$/);
      if (!matchData) {
        continue;
      }
      const rowId = matchData[1];
      const nameId = matchData[2];
      const skillName = skillNameList[rowId][nameId];
      const category = ['暴力', '情動', '知覚', '技術', '知識', '怪異'][nameId];
      skillElement.appendChild(
        DataElement.create(
          `特技${skillCount}`,
          `${skillName}(${category})`,
          {},
          `特技${skillCount}_${gameCharacter.identifier}`
        )
      );
    }

    /*
     * アイテム
     */
    const itemElement = DataElement.create(
      'アイテム',
      '',
      {},
      'アイテム' + gameCharacter.identifier
    );
    gameCharacter.detailDataElement.appendChild(itemElement);
    for (const item of json.item) {
      if (!item.name) {
        continue;
      }
      itemElement.appendChild(
        DataElement.create(
          item.name,
          2,
          { type: 'numberResource', currentValue: item.count || '0' },
          item.name + '_' + gameCharacter.identifier
        )
      );
    }

    /*
     * 人物欄
     */
    const emotionList = [
      ['共感', '友情', '愛情', '忠誠', '憧憬', '狂信'],
      ['不信', '怒り', '妬み', '侮蔑', '劣等感', '殺意']
    ];
    const personalityElement = DataElement.create(
      '人物欄',
      '',
      {},
      '人物欄' + gameCharacter.identifier
    );
    gameCharacter.detailDataElement.appendChild(personalityElement);
    let personalityCount = 0;
    for (const personality of json.personalities) {
      if (!personality.name) {
        continue;
      }
      personalityCount++;
      const emotion =
        emotionList[personality.direction - 1][personality.emotion - 1];
      personalityElement.appendChild(
        DataElement.create(
          `感情${personalityCount}`,
          `${personality.name}(${emotion})`,
          {},
          `感情${personalityCount}_${gameCharacter.identifier}`
        )
      );
    }

    /*
     * アビリティ
     */
    const abilityElement = DataElement.create(
      'アビリティ　タイプ／指定特技／効果',
      '',
      {},
      'アビリティ' + gameCharacter.identifier
    );
    gameCharacter.detailDataElement.appendChild(abilityElement);
    for (const ability of json.ability) {
      if (!ability.name) {
        continue;
      }
      abilityElement.appendChild(
        DataElement.create(
          ability.name,
          `${ability.type}／${ability.targetSkill}／${ability.effect}`,
          { type: 'note' },
          ability.name + '_' + gameCharacter.identifier
        )
      );
    }

    const domParser: DOMParser = new DOMParser();
    domParser.parseFromString(
      gameCharacter.rootDataElement.toXml(),
      'application/xml'
    );

    const palette: ChatPalette = new ChatPalette(
      'ChatPalette_' + gameCharacter.identifier
    );
    palette.dicebot = 'Insane';
    // チャパレ内容
    let cp = `1D6
2D6
2D6>=
2D6>=5
FT 【感情表】
ST 【シーン表】
RTT 【ランダム特技決定表】
BET 【バッドエンド表】

`;
    cp += json.ability
      .filter((ability: any) => ability.name)
      .reduce(
        (txt: string, ability: any) =>
          txt + `[${ability.name}] {${ability.name}}\n`,
        ''
      );
    cp += `
RTT 【ランダム特技決定表】
TVT 【指定特技(暴力)表】
TET 【指定特技(情動)表】
TPT 【指定特技(知覚)表】
TST 【指定特技(技術)表】
TKT 【指定特技(知識)表】
TMT 【指定特技(怪異)表】
`;

    palette.setPalette(cp);
    palette.initialize();
    gameCharacter.appendChild(palette);

    gameCharacter.update();
    return [gameCharacter];
  }
}
