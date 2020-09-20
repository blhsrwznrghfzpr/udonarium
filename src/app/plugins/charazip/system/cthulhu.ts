import { ChatPalette } from '@udonarium/chat-palette';

import { CustomCharacter, Utils } from '../custom-character';
import { VampireBloodFactory } from '../system-factory';

/**
 * キャラクター保管所 クトゥルフ
 */
export class Cthulhu implements VampireBloodFactory {
  gameSystem = 'coc';
  name = 'クトゥルフ';
  href = 'https://charasheet.vampire-blood.net/list_coc.html';
  create = Cthulhu.create;

  static vampireBloodFactory(): VampireBloodFactory {
    return new Cthulhu();
  }

  private static create(json: any, url: string): CustomCharacter[] {
    const gameCharacter: CustomCharacter = CustomCharacter.createCustomCharacter(
      json.pc_name,
      1,
      ''
    );

    /*
     * リソース
     */
    const resourceElement = Utils.createDataElement('リソース', '');
    gameCharacter.detailDataElement.appendChild(resourceElement);
    resourceElement.appendChild(
      Utils.createResourceElement('HP', json.NA9, json.NA9)
    );
    resourceElement.appendChild(
      Utils.createResourceElement('MP', json.NA10, json.NA10)
    );
    resourceElement.appendChild(
      Utils.createResourceElement('SAN', json.SAN_Max, json.SAN_Left)
    );
    resourceElement.appendChild(
      Utils.createResourceElement('神話技能', 99, json.TKAP[3])
    );
    resourceElement.appendChild(
      Utils.createResourceElement('不定領域', 99, json.SAN_Danger)
    );

    /*
     *情報
     */
    const infoElement = Utils.createDataElement('情報', '');
    gameCharacter.detailDataElement.appendChild(infoElement);
    infoElement.appendChild(Utils.createDataElement('PL', ''));
    // 持ち物
    const items = json.item_name.filter((item: any) => item).join('/');
    const arms = json.arms_name.filter((arm: any) => arm).join('/');
    infoElement.appendChild(
      Utils.createNoteElement('持ち物', `${items}/${arms}`)
    );
    infoElement.appendChild(
      Utils.createNoteElement('プロフ', json.pc_making_memo)
    );
    infoElement.appendChild(Utils.createNoteElement('URL', url));

    /*
     *能力値
     */
    const abilityElement = Utils.createDataElement('能力値', '');
    gameCharacter.detailDataElement.appendChild(abilityElement);
    abilityElement.appendChild(Utils.createDataElement('STR', json.NP1));
    abilityElement.appendChild(Utils.createDataElement('CON', json.NP2));
    abilityElement.appendChild(Utils.createDataElement('POW', json.NP3));
    abilityElement.appendChild(Utils.createDataElement('DEX', json.NP4));
    abilityElement.appendChild(Utils.createDataElement('APP', json.NP5));
    abilityElement.appendChild(Utils.createDataElement('SIZ', json.NP6));
    abilityElement.appendChild(Utils.createDataElement('INT', json.NP7));
    abilityElement.appendChild(Utils.createDataElement('EDU', json.NP8));
    abilityElement.appendChild(Utils.createDataElement('db', json.dmg_bonus));

    /*
     *戦闘技能
     */
    const combatElement = Utils.createDataElement('戦闘技能', '');
    gameCharacter.detailDataElement.appendChild(combatElement);
    let combatSkillNames = [
      '回避',
      'キック',
      '組み付き',
      'こぶし(パンチ)',
      '頭突き',
      '投擲',
      'マーシャルアーツ',
      '拳銃',
      'サブマシンガン',
      'ショットガン',
      'マシンガン',
      'ライフル',
    ];
    if (json.TBAName) {
      combatSkillNames = combatSkillNames.concat(json.TBAName);
    }
    for (let i = 0; i < combatSkillNames.length; i++) {
      const skillName = combatSkillNames[i];
      if (!skillName) {
        continue;
      }
      const skillPoint = json.TBAP[i];
      combatElement.appendChild(Utils.createDataElement(skillName, skillPoint));
    }

    /*
     * 探索技能
     */
    const exploreElement = Utils.createDataElement('探索技能', '');
    gameCharacter.detailDataElement.appendChild(exploreElement);
    let exploreSkillNames = [
      '応急手当',
      '鍵開け',
      '隠す',
      '隠れる',
      '聞き耳',
      '忍び歩き',
      '写真術',
      '精神分析',
      '追跡',
      '登攀',
      '図書館',
      '目星',
    ];
    if (json.TFAName) {
      exploreSkillNames = exploreSkillNames.concat(json.TFAName);
    }
    for (let i = 0; i < exploreSkillNames.length; i++) {
      const skillName = exploreSkillNames[i];
      if (!skillName) {
        continue;
      }
      const skillPoint = json.TFAP[i];
      exploreElement.appendChild(
        Utils.createDataElement(skillName, skillPoint)
      );
    }

    /*
     * 行動技能
     */
    const actionElement = Utils.createDataElement('行動技能', '');
    gameCharacter.detailDataElement.appendChild(actionElement);
    let actionSkillNames = [
      json.unten_bunya ? `運転(${json.unten_bunya})` : '運転',
      '機械修理',
      '重機械操作',
      '乗馬',
      '水泳',
      json.seisaku_bunya ? `製作(${json.seisaku_bunya})` : '製作',
      json.main_souju_norimono ? `操縦(${json.main_souju_norimono})` : '操縦',
      '跳躍',
      '電気修理',
      'ナビゲート',
      '変装',
    ];
    if (json.TAAName) {
      actionSkillNames = actionSkillNames.concat(json.TAAName);
    }
    for (let i = 0; i < actionSkillNames.length; i++) {
      const skillName = actionSkillNames[i];
      if (!skillName) {
        continue;
      }
      const skillPoint = json.TAAP[i];
      actionElement.appendChild(Utils.createDataElement(skillName, skillPoint));
    }

    /*
     * 交渉技能
     */
    const negotiateElement = Utils.createDataElement('交渉技能', '');
    gameCharacter.detailDataElement.appendChild(negotiateElement);
    let negotiateSkillNames = [
      '言いくるめ',
      '信用',
      '説得',
      '値切り',
      json.mylang_name ? `母国語(${json.mylang_name})` : '母国語',
    ];
    if (json.TCAName) {
      negotiateSkillNames = negotiateSkillNames.concat(json.TCAName);
    }
    for (let i = 0; i < negotiateSkillNames.length; i++) {
      const skillName = negotiateSkillNames[i];
      if (!skillName) {
        continue;
      }
      const skillPoint = json.TCAP[i];
      negotiateElement.appendChild(
        Utils.createDataElement(skillName, skillPoint)
      );
    }

    /*
     * 知識技能
     */
    const knowledgeElement = Utils.createDataElement('知識技能', '');
    gameCharacter.detailDataElement.appendChild(knowledgeElement);
    let knowledgeSkillNames = [
      '医学',
      'オカルト',
      '化学',
      null, // "クトゥルフ神話",        // リソース欄に記載するため、こちらには記載しない
      json.geijutu_bunya ? `芸術(${json.geijutu_bunya})` : '芸術',
      '経理',
      '考古学',
      'コンピューター',
      '心理学',
      '人類学',
      '生物学',
      '地質学',
      '電子工学',
      '天文学',
      '博物学',
      '物理学',
      '法律',
      '薬学',
      '歴史',
    ];
    if (json.TKAName) {
      knowledgeSkillNames = knowledgeSkillNames.concat(json.TKAName);
    }
    for (let i = 0; i < knowledgeSkillNames.length; i++) {
      const skillName = knowledgeSkillNames[i];
      if (!skillName) {
        continue;
      }
      const skillPoint = json.TKAP[i];
      knowledgeElement.appendChild(
        Utils.createDataElement(skillName, skillPoint)
      );
    }

    const domParser: DOMParser = new DOMParser();
    domParser.parseFromString(gameCharacter.toXml(), 'application/xml');

    const palette: ChatPalette = new ChatPalette(
      'ChatPalette_' + gameCharacter.identifier
    );
    palette.dicebot = 'Cthulhu';
    // チャパレ内容
    let cp = `//-----リソース管理
現在HP {HP}
現在MP {MP}
現在SAN値 {SAN}
CC<={SAN}  :SANチェック
不定領域 {不定領域}

//-----神話技能
CC<={神話技能}  :クトゥルフ神話技能
`;
    cp += '\n//-----戦闘技能\n';
    for (const skillName of combatSkillNames) {
      if (!skillName) {
        continue;
      }
      cp += `CC<={${skillName}}  :${skillName}\n`;
    }
    cp += '\n//-----探索技能\n';
    for (const skillName of exploreSkillNames) {
      if (!skillName) {
        continue;
      }
      cp += `CC<={${skillName}}  :${skillName}\n`;
    }
    cp += '\n//-----行動技能\n';
    for (const skillName of actionSkillNames) {
      if (!skillName) {
        continue;
      }
      cp += `CC<={${skillName}}  :${skillName}\n`;
    }
    cp += '\n//-----交渉技能\n';
    for (const skillName of negotiateSkillNames) {
      if (!skillName) {
        continue;
      }
      cp += `CC<={${skillName}}  :${skillName}\n`;
    }
    cp += '\n//-----知識技能\n';
    for (const skillName of knowledgeSkillNames) {
      if (!skillName) {
        continue;
      }
      cp += `CC<={${skillName}}  :${skillName}\n`;
    }
    cp += `
//-----能力値×５ロール
CC<=({STR}*5)  :STRx5
CC<=({CON}*5)  :CONx5
CC<=({DEX}*5)  :DEXx5
CC<=({APP}*5)  :APPx5
CC<=({EDU}*5)  :EDUx5:知識
CC<=({INT}*5)  :INTx5:ｱｲﾃﾞｱ
CC<=({POW}*5)  :POWx5:幸運
`;
    if (!json.armName) {
      cp += '\n//-----武器・防具\n';
      for (let i = 0; i < json.arms_name.length; i++) {
        const armName = json.arms_name[i];
        if (!armName) {
          continue;
        }
        const armHit = json.arms_hit[i];
        const armDamage = json.arms_damage[i].replace('db', '{db}');
        cp += `CC<=${armHit}  :${armName}\n${armDamage}   :${armName}(ダメージ)\n`;
      }
    }

    palette.setPalette(cp);
    palette.initialize();
    gameCharacter.appendChild(palette);

    gameCharacter.update();
    return [gameCharacter];
  }
}
