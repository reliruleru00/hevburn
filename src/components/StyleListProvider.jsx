import React, { createContext, useState, useEffect, useContext } from "react";
import styleList from "../data/styleList";

const statusKbn = ["", "str", "dex", "con", "mnd", "int", "luk"];
const defaultSelectStyleList = Array(6).fill(undefined);

const StyleListContext = createContext({
  selectTroops: 0,
  styleList: defaultSelectStyleList,
  loadTroops: () => { },
  loadSubTroops: () => { },
  setMember: () => { },
  removeMember: () => { },
  setStyle: () => { },
  setLastUpdatedIndex: () => { },
});

const initialMember = {
  styleInfo: null,
  str: 400,
  dex: 400,
  con: 400,
  mnd: 400,
  int: 400,
  luk: 400,
  jewelLv: 5,
  limitCount: 2,
  earring: 0,
  bracelet: 1,
  chain: 3,
  initSp: 1,
  exclusionSkillList: [],
};

// ----------------- 保存/読み込み処理 -----------------
const saveStyle = (memberInfo) => {
  if (!memberInfo || !memberInfo.styleInfo) return;

  const { style_id } = memberInfo.styleInfo;
  const saveItem = [
    memberInfo.styleInfo.rarity,
    memberInfo.str,
    memberInfo.dex,
    memberInfo.con,
    memberInfo.mnd,
    memberInfo.int,
    memberInfo.luk,
    memberInfo.limitCount,
    memberInfo.jewelLv,
    memberInfo.earring,
    memberInfo.bracelet,
    memberInfo.chain,
    memberInfo.initSp,
  ].join(",");

  localStorage.setItem(`style_${style_id}`, saveItem);
  saveExclusionSkill(memberInfo);
};

const loadStyle = (styleId) => {
  const styleInfo = styleList.find((obj) => obj.style_id === styleId);
  if (!styleInfo) return null;

  const memberInfo = { ...initialMember, styleInfo };
  const saveItem = localStorage.getItem(`style_${styleId}`);
  if (saveItem) {
    const items = saveItem.split(",");
    statusKbn.forEach((key, i) => {
      if (i === 0) return;
      memberInfo[key] = Number(items[i]);
    });
    memberInfo.limitCount = Number(items[7]);
    memberInfo.jewelLv = Number(items[8]);
    memberInfo.earring = Number(items[9]) || 0;
    memberInfo.bracelet = Number(items[10]) || 0;
    memberInfo.chain = Number(items[11]) || 0;
    memberInfo.initSp = Number(items[12]) || 1;
  }

  if (styleInfo.rarity === 2) memberInfo.limitCount = 10;
  else if (styleInfo.rarity === 3) memberInfo.limitCount = 20;

  return memberInfo;
};

const saveExclusionSkill = (memberInfo) => {
  const styleId = memberInfo.styleInfo.style_id;
  localStorage.setItem(`exclusion_${styleId}`, memberInfo.exclusionSkillList.join(","));
};

const loadExclusionSkill = (memberInfo) => {
  const styleId = memberInfo.styleInfo.style_id;
  const data = localStorage.getItem(`exclusion_${styleId}`);
  memberInfo.exclusionSkillList = data ? data.split(",").map(Number) : [];
};

// ----------------- メンバー処理 -----------------
const loadTroopsList = (troopsNo) => {
  const selectStyleList = Array(6).fill(undefined);
  for (let i = 0; i < 6; i++) {
    const styleId = Number(localStorage.getItem(`troops_${troopsNo}_${i}`));
    if (!isNaN(styleId) && styleId !== 0) {
      setStyleMember(selectStyleList, troopsNo, i, styleId);
    }
  }
  return selectStyleList;
};

const setStyleMember = (list, troops, index, styleId) => {
  const memberInfo = loadStyle(styleId);
  if (!memberInfo) return;
  const styleInfo = memberInfo.styleInfo;

  for (let i = 0; i < list.length; i++) {
    if (i !== index && list[i]?.styleInfo.chara_id === styleInfo.chara_id) {
      list[i] = list[index];
      localStorage.setItem(`troops_${troops}_${i}`, list[i]?.styleInfo?.style_id ?? null);
    }
  }

  loadExclusionSkill(memberInfo);
  list[index] = memberInfo;
};

const removeStyleMember = (list, index) => {
  list[index] = undefined;
};

// ----------------- Provider Component -----------------
const StyleListProvider = ({ children }) => {
  let selectTroops = Number(localStorage.getItem("select_troops") || 0);

  const [styleList, setStyleList] = useState({
    selectStyleList: loadTroopsList(selectTroops),
    selectTroops,
    subStyleList: Array(6).fill(undefined),
    troopsName: localStorage.getItem(`troops_${selectTroops}_name`),
    subTroops: "-1",
  });

  const [lastUpdatedIndex, setLastUpdatedIndex] = useState(null);

  useEffect(() => {
    if (lastUpdatedIndex !== null) {
      saveStyle(styleList.selectStyleList[lastUpdatedIndex]);
      setLastUpdatedIndex(null);
    }
  }, [styleList, lastUpdatedIndex]);

  const loadTroops = (troops) => {
    const updatedList = loadTroopsList(troops);
    setStyleList({
      ...styleList,
      selectStyleList: updatedList,
      selectTroops: troops,
      subStyleList: Array(6).fill(undefined),
      troopsName: localStorage.getItem(`troops_${troops}_name`),
      subTroops: "-1",
    });
  };

  const loadSubTroops = (subTroops) => {
    const updatedList = loadTroopsList(subTroops);
    setStyleList((prev) => ({ ...prev, subStyleList: updatedList, subTroops }));
  };

  const setMember = (index, style_id) => {
    const updatedList = [...styleList.selectStyleList];
    setStyleMember(updatedList, styleList.selectTroops, index, style_id);
    setStyleList({ ...styleList, selectStyleList: updatedList });
  };

  const removeMember = (index) => {
    const updatedList = [...styleList.selectStyleList];
    removeStyleMember(updatedList, index);
    setStyleList({ ...styleList, selectStyleList: updatedList });
  };

  const saveMember = (index) => {
    saveStyle(styleList.selectStyleList[index]);
  };

  const loadMember = (styleId) => {
    return loadStyle(styleId);
  };

  const setStyle = (style, index) => {
    const updatedList = [...styleList.selectStyleList];
    updatedList[index] = style;
    setStyleList({ ...styleList, selectStyleList: updatedList });
  };

  return (
    <StyleListContext.Provider
      value={{
        styleList,
        setStyleList,
        loadTroops,
        loadSubTroops,
        setMember,
        removeMember,
        saveMember,
        loadMember,
        setStyle,
        setLastUpdatedIndex,
      }}
    >
      {children}
    </StyleListContext.Provider>
  );
};

export default StyleListProvider;

// ----------------- カスタムフック -----------------
export const useStyleList = () => useContext(StyleListContext);
