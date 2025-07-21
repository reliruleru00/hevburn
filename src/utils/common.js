import pako from 'pako';
import charaData from '../data/charaData';
import skillList from "../data/skillList";
import skillBuff from "../data/skillBuff";
import skillPassive from "../data/skillPassive";
import abilityList from "../data/abilityList";

// キャラ名取得
export function getCharaData(charaId) {
  const filteredChara = charaData.filter((obj) => obj.chara_id === charaId);
  return filteredChara.length > 0 ? filteredChara[0] : undefined;
}

// スキルデータ取得
export function getSkillData(skillId) {
    const filteredSkill = skillList.filter((obj) => obj.skill_id === skillId);
    return filteredSkill.length > 0 ? filteredSkill[0] : undefined;
}

// バフ情報取得
export function getBuffIdToBuff(buffId) {
    const filteredBuff = skillBuff.filter((obj) => obj.buff_id === buffId);
    return filteredBuff.length > 0 ? filteredBuff[0] : undefined;
}

// アビリティ情報取得
export function getAbilityInfo(abilityId) {
    const filteredAbility = abilityList.filter((obj) => obj.ability_id === abilityId);
    return filteredAbility.length > 0 ? filteredAbility[0] : undefined;
}

// パッシブ情報取得
export function getPassiveInfo(skillId) {
    const filteredPassive = skillPassive.filter((obj) => obj.skill_id === skillId);
    return filteredPassive.length > 0 ? skillPassive[0] : undefined;
}

// 文字列を圧縮
export function compressString(inputString) {
  const compressedData = pako.deflate(inputString);
  const compressedString = btoa(String.fromCharCode.apply(null, compressedData));
  return compressedString;
}

// 圧縮された文字列を解凍
export function decompressString(compressedString) {
  const compressedDataBuffer = new Uint8Array(atob(compressedString).split('').map(function (c) { return c.charCodeAt(0); }));
  const decompressedData = pako.inflate(compressedDataBuffer);
  const decompressedString = new TextDecoder().decode(decompressedData);
  return decompressedString;
}
