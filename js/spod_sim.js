let select_troops = localStorage.getItem('select_troops');
let select_style_list = Array(6).fill(undefined);
// 使用不可スタイル
const NOT_USE_STYLE = [];
// 謎の処理順序
const ACTION_ORDER = [1, 0, 2, 3, 4, 5];
// 残ターン消費バフ
// 星屑の航路/星屑の航路+/バウンシー・ブルーミー/月光/流れ星に唄えば/チャーミングボイス/かき鳴らせキラーチューン/ジャムセッション
const REST_TURN_COST_BUFF = [67, 491, 523, 567, 568, 573, 575, 577];

const styleSheet = document.createElement('style');
document.head.appendChild(styleSheet);
let turn_list = [];
let battle_enemy_info;
let physical_name = ["", "斬", "突", "打"];
let element_name = ["無", "火", "氷", "雷", "光", "闇"];
let next_display;

const KB_NEXT_ACTION = 1;
const KB_NEXT_ACTION_OD = 2;
const KB_NEXT_ADDITIONALTURN = 3;

const ABILIRY_BATTLE_START = 0;
const ABILIRY_SELF_START = 1;
const ABILIRY_ACTION_START = 2;
const ABILIRY_ENEMY_START = 3;
const ABILIRY_ADDITIONALTURN = 4;
const ABILIRY_OD_START = 5;
const ABILIRY_BREAK = 6;
const ABILIRY_RECEIVE_DAMAGE = 7;
const ABILIRY_EX_SKILL_USE = 8;
const ABILIRY_OTHER = 99;

const BUFF_FUNNEL_LIST = [BUFF_FUNNEL, BUFF_ABILITY_FUNNEL];
const SINGLE_BUFF_LIST = [BUFF_CHARGE, BUFF_RECOIL, BUFF_ARROWCHERRYBLOSSOMS, BUFF_ETERNAL_OARH, BUFF_EX_DOUBLE, BUFF_BABIED, BUFF_DIVA_BLESS];
const FIELD_LIST = {
    [FIELD_NORMAL]: "無し",
    [FIELD_FIRE]: "火",
    [FIELD_ICE]: "氷",
    [FIELD_THUNDER]: "雷",
    [FIELD_LIGHT]: "光",
    [FIELD_DARK]: "闇",
    [FIELD_RICE]: "稲穂",
    [FIELD_SANDSTORM]: "砂嵐"
}
class turn_data {
    constructor() {
        this.turn_number = 0;
        this.over_drive_turn = 0;
        this.over_drive_max_turn = 0;
        this.trigger_over_drive = false;
        this.additional_turn = false;
        this.enemy_debuff_list = [];
        this.unit_list = [];
        this.start_over_drive_gauge = 0;
        this.over_drive_gauge = 0;
        this.add_over_drive_gauge = 0;
        this.enemy_count = 1;
        this.fg_action = false;
        this.front_sp_add = 0;
        this.back_sp_add = 0;
        this.step_turn = 0;
        this.step_over_drive_down = 0;
        this.step_sp_down = 0;
        this.sp_cost_down = 0;
        this.field = 0;
        this.field_turn = 0;
        this.user_operation = {}
    }

    unitLoop(func) {
        $.each(this.unit_list, function (index, unit) {
            if (!unit.blank) {
                func(unit);
            }
        });
    }

    unitOrderLoop(func) {
        const self = this;
        ACTION_ORDER.forEach(function (index) {
            let unit = self.unit_list[index];
            if (!unit.blank) {
                func(unit);
            }
        });
    }

    // 1:通常戦闘,2:後打ちOD,3:追加ターン
    turnProceed(kb_next) {
        this.enemy_debuff_list.sort((a, b) => a.buff_kind - b.buff_kind);
        if (kb_next == KB_NEXT_ACTION) {
            // オーバードライブ
            if (this.over_drive_max_turn > 0) {
                this.over_drive_turn++;
                this.unitLoop(function (unit) {
                    unit.unitOverDriveTurnProceed();
                });
                if (this.over_drive_max_turn < this.over_drive_turn) {
                    // オーバードライブ終了
                    this.over_drive_max_turn = 0;
                    this.over_drive_turn = 0;
                    if (this.fg_action) {
                        this.nextTurn();
                    }
                }
            } else {
                this.nextTurn();
            }
        } else if (kb_next == KB_NEXT_ADDITIONALTURN) {
            // 追加ターン
            this.unitLoop(function (unit) {
                unit.unitAdditionalTurnProceed();
            });
        } else {
            // 行動開始＋OD発動
            this.startOverDrive();
            this.fg_action = true;
            this.unitLoop(function (unit) {
                unit.unitOverDriveTurnProceed();
            });
        }
        this.unitLoop(function (unit) {
            unit.unitTurnInit();
        });
        // ターンごとに初期化
        this.trigger_over_drive = false;
        this.start_over_drive_gauge = this.over_drive_gauge;
        this.user_operation = {
            field: this.field,
            enemy_count: this.enemy_count,
            select_skill: this.unit_list.map(function (unit) {
                return unit.blank ? 0 : unit.select_skill_id;
            }),
            trigger_over_drive: false,
            selected_place_no: -1,
            kb_action: KB_NEXT_ACTION,
        }
    }

    nextTurn() {
        let self = this;
        // 通常進行
        this.unitLoop(function (unit) {
            unit.unitTurnProceed(self);
        });

        this.turn_number++;
        this.fg_action = false;
        this.abilityAction(ABILIRY_RECEIVE_DAMAGE);
        this.abilityAction(ABILIRY_SELF_START);
        if (this.turn_number % this.step_turn == 0 && this.over_drive_gauge > 0) {
            this.over_drive_gauge += this.step_over_drive_down;
            if (this.over_drive_gauge < 0) {
                this.over_drive_gauge = 0;
            }
        }
        // 敵のデバフ消費
        this.debuffConsumption();
    }
    unitSort() {
        this.unit_list.sort((a, b) => a.place_no - b.place_no);
    }
    getTurnNumber() {
        const defalt_turn = "ターン" + this.turn_number;
        // 追加ターン
        if (this.additional_turn) {
            return `${defalt_turn} 追加ターン`;
        }
        // オーバードライブ中
        if (this.over_drive_turn > 0) {
            return `${defalt_turn} OverDrive${this.over_drive_turn}/${this.over_drive_max_turn}`;
        }
        return defalt_turn;
    }
    addOverDrive(add_od_gauge) {
        this.over_drive_gauge += add_od_gauge;
        if (this.over_drive_gauge > 300) {
            this.over_drive_gauge = 300;
        }
    }
    startOverDrive() {
        let over_drive_level = Math.floor(this.over_drive_gauge / 100)
        this.over_drive_turn = 1;
        this.over_drive_max_turn = over_drive_level;
        this.over_drive_gauge = 0;
        this.add_over_drive_gauge = 0;

        let sp_list = [0, 5, 12, 20];
        this.unitLoop(function (unit) {
            unit.over_drive_sp = sp_list[over_drive_level];
        });
        this.trigger_over_drive = true;
    }
    removeOverDrive() {
        this.over_drive_turn = 0;
        this.over_drive_max_turn = 0;
        this.over_drive_gauge = this.start_over_drive_gauge;
        this.add_over_drive_gauge = 0;

        this.unitLoop(function (unit) {
            unit.over_drive_sp = 0;
        });
        this.trigger_over_drive = false;

    }
    debuffConsumption() {
        for (let i = this.enemy_debuff_list.length - 1; i >= 0; i--) {
            let debuff = this.enemy_debuff_list[i];
            if (debuff.rest_turn == 1) {
                this.enemy_debuff_list.splice(i, 1);
            } else {
                debuff.rest_turn -= 1;
            }
        }
    }
    abilityAction(action_kbn) {
        const self = this;
        this.unitOrderLoop(function (unit) {
            unit.abilityAction(self, action_kbn)
        });
    }
}

// アビリティ存在チェック
function checkAbilityExist(ability_list, ability_id) {
    let exist_list = ability_list.filter(function (ability_info) {
        return ability_info.ability_id == ability_id;
    });
    return exist_list.length > 0;
}

// パッシブ存在チェック
function checkPassiveExist(passive_list, skill_id) {
    let exist_list = passive_list.filter(function (value) {
        return value == skill_id;
    });
    return exist_list.length > 0;
}

// バフ存在チェック
function checkBuffExist(buff_list, buff_kind) {
    let exist_list = buff_list.filter(function (buff_info) {
        return buff_info.buff_kind == buff_kind;
    });
    return exist_list.length > 0;
}

// バフ存在チェック
function checkBuffIdExist(buff_list, buff_id) {
    let exist_list = buff_list.filter(function (buff_info) {
        return buff_info.buff_id == buff_id;
    });
    return exist_list.length > 0;
}

// メンバー存在チェック
function checkMember(unit_list, troops) {
    let member_list = unit_list.filter(function (unit_info) {
        if (unit_info.style) {
            let chara_info = getCharaData(unit_info.style.style_info.chara_id);
            return chara_info.troops == troops;
        }
        return false;
    });
    return member_list.length;
}

class unit_data {
    constructor() {
        this.place_no = 99;
        this.sp = 1;
        this.over_drive_sp = 0;
        this.add_sp = 0;
        this.sp_cost = 0;
        this.buff_list = [];
        this.additional_turn = false;
        this.normal_attack_element = 0;
        this.earring_effect_size = 0;
        this.skill_list = [];
        this.blank = false;
        this.use_skill_list = [];
        this.buff_target_chara_id = null;
        this.buff_effect_select_type = 0;
        this.ability_battle_start = [];
        this.ability_self_start = [];
        this.ability_action_start = [];
        this.ability_enemy_start = [];
        this.ability_additional_turn = [];
        this.ability_over_drive = [];
        this.ability_ex_skill_use = [];
        this.ability_receive_damage = [];
        this.ability_other = [];
        this.next_turn_min_sp = -1;
        this.select_skill_id = 0;
        this.init_skill_id = 0;
    }

    unitTurnInit() {
        this.buff_effect_select_type = 0;
    }
    unitTurnProceed(turn_data) {
        this.buffSort();
        if (this.next_turn_min_sp > 0) {
            if (this.next_turn_min_sp > this.sp) {
                this.sp = this.next_turn_min_sp;
                this.next_turn_min_sp = -1
            }
        }
        if (this.sp < 20) {
            this.sp += 2;
            if (this.place_no < 3) {
                this.sp += turn_data.front_sp_add;
            } else {
                this.sp += turn_data.back_sp_add;
            }
            if ((turn_data.turn_number + 1) % turn_data.step_turn == 0) {
                this.sp += turn_data.step_sp_down;
            }
            if (this.sp > 20) {
                this.sp = 20
            }
        }

        for (let i = this.buff_list.length - 1; i >= 0; i--) {
            let buff = this.buff_list[i];
            if (buff.rest_turn == 1) {
                this.buff_list.splice(i, 1);
            } else {
                buff.rest_turn -= 1;
            }
        }
        if (this.place_no < 3) {
            this.select_skill_id = this.init_skill_id;
        } else {
            this.select_skill_id = 0;
        }
    }
    unitOverDriveTurnProceed() {
        this.buffSort();
        // ターン消費
        this.specialRestTurn();
        // OverDriveゲージをSPに加算
        this.sp += this.over_drive_sp;
        if (this.sp > 99) this.sp = 99;
        this.over_drive_sp = 0;

        if (this.place_no < 3) {
            this.select_skill_id = this.init_skill_id;
        } else {
            this.select_skill_id = 0;
        }

    }

    unitAdditionalTurnProceed() {
        if (this.additional_turn) {
            // ターン消費
            this.specialRestTurn();
            this.select_skill_id = this.init_skill_id;
        } else {
            this.select_skill_id = 0;
        }
    }

    specialRestTurn() {
        // 追加ターンODのみのターン消費
        for (let i = this.buff_list.length - 1; i >= 0; i--) {
            let buff_info = this.buff_list[i];
            // ターン消費バフ
            if (REST_TURN_COST_BUFF.includes(buff_info.skill_id)) {
                if (buff_info.rest_turn == 1) {
                    this.buff_list.splice(i, 1);
                } else {
                    buff_info.rest_turn -= 1;
                }
            }
            // 行動不能
            if (buff_info.buff_kind == BUFF_RECOIL) {
                if (buff_info.rest_turn == 1) {
                    this.buff_list.splice(i, 1);
                } else {
                    buff_info.rest_turn -= 1;
                }
            }
        }
    }

    buffSort() {
        this.buff_list.sort((a, b) => {
            if (a.buff_kind === b.buff_kind) {
                return a.effect_size - b.effect_size;
            }
            return a.buff_kind - b.buff_kind;
        });
    }
    payCost() {
        if (this.sp_cost == 99) {
            this.sp = 0;
            this.over_drive_sp = 0;
        } else {
            // OD上限突破
            if (this.sp + this.over_drive_sp > 99) {
                this.sp = 99 - this.over_drive_sp;
            }
            this.sp -= this.sp_cost;
        }
        this.sp_cost = 0;
    }

    getEarringEffectSize(hit_count) {
        // ドライブ
        if (this.earring_effect_size != 0) {
            hit_count = hit_count < 1 ? 1 : hit_count;
            hit_count = hit_count > 10 ? 10 : hit_count;
            return (this.earring_effect_size - ((this.earring_effect_size - 5) / 9 * (10 - hit_count)));
        }
        return 0;
    }
    getFunnelList() {
        let ret = [];
        let buff_funnel_list = this.buff_list.filter(function (buff_info) {
            return BUFF_FUNNEL == buff_info.buff_kind && !ALONE_ACTIVATION_BUFF_LIST.includes(buff_info.buff_id);
        });
        let buff_unit_funnel_list = this.buff_list.filter(function (buff_info) {
            return BUFF_FUNNEL == buff_info.buff_kind && ALONE_ACTIVATION_BUFF_LIST.includes(buff_info.buff_id);
        });
        let ability_list = this.buff_list.filter(function (buff_info) {
            return BUFF_ABILITY_FUNNEL == buff_info.buff_kind;
        });

        // effect_sumで降順にソート
        buff_funnel_list.sort(function (a, b) {
            return b.effect_sum - a.effect_sum;
        });
        buff_unit_funnel_list.sort(function (a, b) {
            return b.effect_sum - a.effect_sum;
        });
        ability_list.sort(function (a, b) {
            return b.effect_sum - a.effect_sum;
        });
        // 単独発動の効果値判定
        let buff_total = buff_funnel_list.slice(0, 2).reduce(function (sum, element) {
            return sum + element["effect_sum"];
        }, 0);
        let buff_unit_total = buff_unit_funnel_list.slice(0, 1).reduce(function (sum, element) {
            return sum + element["effect_sum"];
        }, 0);
        if (buff_total <= buff_unit_total) {
            ret = buff_unit_funnel_list.slice(0, 1)
        } else {
            ret = buff_funnel_list.slice(0, 2)
            buff_funnel_list = buff_funnel_list.slice(2);
        }
        // アビリティを追加
        if (ability_list.length > 0) {
            ret.push(ability_list[0]);
        }

        // 新しいリストを作成
        let result_list = [];

        // 各要素のeffect_count分effect_unitを追加
        ret.forEach(function (item) {
            for (let i = 0; i < item.max_power; i++) {
                result_list.push(item.effect_size);
            }
            item.use_funnel = true;
        });
        // 使用後にリストから削除
        this.buff_list = this.buff_list.filter(function (item) {
            return !item.use_funnel || ALONE_ACTIVATION_BUFF_LIST.includes(item.buff_id) || ALONE_ACTIVATION_ABILITY_LIST.includes(item.ability_id);
        })
        return result_list;
    }

    abilityAction(turn_data, action_kbn) {
        let self = this;
        let action_list = [];
        switch (action_kbn) {
            case ABILIRY_BATTLE_START: // 戦闘開始時
                action_list = self.ability_battle_start;
                break;
            case ABILIRY_SELF_START: // 自分のターン開始時
                action_list = self.ability_self_start;
                break;
            case ABILIRY_ACTION_START: // 行動開始時
                action_list = self.ability_action_start;
                break;
            case ABILIRY_ENEMY_START: // 敵のターン開始時
                action_list = self.ability_enemy_start;
                break;
            case ABILIRY_ADDITIONALTURN: // 追加ターン
                action_list = self.ability_additional_turn;
                break;
            case ABILIRY_OD_START: // オーバードライブ開始時
                action_list = self.ability_over_drive;
                break;
            case ABILIRY_EX_SKILL_USE: // EXスキル使用
                action_list = self.ability_ex_skill_use;
                break;
            case ABILIRY_RECEIVE_DAMAGE: // 被ダメージ時
                // 前衛のみ
                if (self.place_no < 3) {
                    action_list = self.ability_receive_damage;
                }
                break;
            case ABILIRY_OTHER: // その他
                action_list = self.ability_other;
                break;
        }
        $.each(action_list, function (index, ability) {
            // 前衛
            if (ability.activation_place == 1 && self.place_no >= 3) {
                return true;
            }
            // 後衛
            if (ability.activation_place == 2 && self.place_no < 3) {
                return true;
            }
            let target_list = getTargetList(turn_data, ability.range_area, ability.target_element, self.place_no, null);
            let buff;
            switch (ability.conditions) {
                case "火属性フィールド":
                    if (turn_data.field != FIELD_FIRE) {
                        return;
                    }
                    break;
                case "歌姫の加護":
                    if (!checkBuffExist(self.buff_list, BUFF_DIVA_BLESS)) {
                        return;
                    };
                    break;
                case "SP0以下":
                    if (this.sp > 0) {
                        return;
                    }
                    break;

            }
            switch (ability.effect_type) {
                case EFFECT_FUNNEL: // 連撃数アップ
                    buff = new buff_data();
                    buff.ability_id = ability.ability_id;
                    buff.buff_kind = BUFF_ABILITY_FUNNEL;
                    buff.buff_name = ability.ability_name;
                    buff.buff_element = 0;
                    buff.max_power = ability.effect_count;
                    buff.effect_size = ability.effect_size;
                    buff.effect_sum = ability.effect_size * ability.effect_count;
                    buff.rest_turn = -1;
                    self.buff_list.push(buff);
                    break;
                case EFFECT_HEALSP: // SP回復
                    $.each(target_list, function (index, target_no) {
                        let unit_data = getUnitData(turn_data, target_no);
                        if (unit_data.sp < 20) {
                            if (ability.ability_id) {
                                switch (ability.ability_id) {
                                    case 1109: // 吉報
                                    case 1119: // 旺盛
                                        unit_data.add_sp += ability.effect_size;
                                        break;
                                    case 1112: // 好機
                                        if (unit_data.sp <= 3) {
                                            unit_data.sp += ability.effect_size;
                                        }
                                        break;
                                    case 1118: // 充填
                                        // チャージ存在チェック
                                        if (checkBuffExist(unit_data.buff_list, BUFF_CHARGE)) {
                                            unit_data.sp += ability.effect_size;
                                        }
                                        break;
                                    case 1111: // みなぎる士気
                                        let exist_list = unit_data.buff_list.filter(function (buff_info) {
                                            return buff_info.buff_kind == BUFF_MORALE;
                                        });
                                        if (exist_list.length > 0) {
                                            if (exist_list[0].lv >= 6) {
                                                unit_data.sp += ability.effect_size;
                                            }
                                        }
                                        break;
                                    case 1204: // エンゲージリンク
                                        // 永遠なる誓いチェック
                                        if (checkBuffExist(unit_data.buff_list, BUFF_ETERNAL_OARH)) {
                                            unit_data.sp += ability.effect_size;
                                        }
                                        break;
                                    default:
                                        unit_data.sp += ability.effect_size;
                                        break;
                                }
                            }
                            if (ability.skill_id) {
                                switch (ability.skill_id) {
                                    case 524: // 痛気持ちいぃ～！
                                        unit_data.add_sp += ability.effect_size;
                                        break;
                                    default:
                                        unit_data.sp += ability.effect_size;
                                        break;
                                }
                            }
                            if (unit_data.sp > 20) {
                                unit_data.sp = 20
                            }
                        }
                    });
                    break;
                case EFFECT_MORALE: // 士気
                    $.each(target_list, function (index, target_no) {
                        let unit_data = getUnitData(turn_data, target_no);
                        if (!unit_data.style) {
                            return true;
                        }

                        let exist_list = unit_data.buff_list.filter(function (buff_info) {
                            return buff_info.buff_kind == BUFF_MORALE;
                        });
                        let buff;
                        if (exist_list.length > 0) {
                            buff = exist_list[0];
                        } else {
                            buff = new buff_data();
                            buff.buff_kind = BUFF_MORALE;
                            buff.buff_element = 0;
                            buff.rest_turn = -1;
                            buff.buff_name = ability.ability_name;
                            unit_data.buff_list.push(buff);
                        }
                        if (buff.lv < 10) {
                            buff.lv += ability.effect_size;
                        }
                    });
                    break;
                case EFFECT_OVERDRIVEPOINTUP: // ODアップ
                    turn_data.over_drive_gauge += ability.effect_size;
                    if (turn_data.over_drive_gauge > 300) {
                        turn_data.over_drive_gauge = 300;
                    }
                    break;
                case EFFECT_ARROWCHERRYBLOSSOMS: // 桜花の矢
                    buff = new buff_data();
                    buff.buff_kind = BUFF_ARROWCHERRYBLOSSOMS;
                    buff.buff_element = 0;
                    buff.rest_turn = -1;
                    buff.buff_name = ability.ability_name;
                    self.buff_list.push(buff);
                    break;
                case EFFECT_CHARGE: // チャージ
                    buff = new buff_data();
                    buff.buff_kind = BUFF_CHARGE;
                    buff.buff_element = 0;
                    buff.rest_turn = -1;
                    buff.buff_name = ability.ability_name;
                    self.buff_list.push(buff);
                    break;
                case EFFECT_FIELD_DEPLOYMENT: // フィールド
                    if (ability.element) {
                        turn_data.field = ability.element;
                    } else if (ability.skill_id == 525) {
                        // いつの日かここで
                        turn_data.field = FIELD_RICE;
                    }
                    break;
                case EFFECT_NEGATIVE: // ネガティブ
                    buff = new buff_data();
                    buff.buff_kind = BUFF_NAGATIVE;
                    buff.buff_element = 0;
                    buff.rest_turn = ability.effect_count + 1;
                    buff.buff_name = ability.ability_name;
                    self.buff_list.push(buff);
                    break;
            }
        });
    }
}
class buff_data {
    constructor() {
        this.rest_turn = -1;
        this.effect_size = 0;
        this.buff_kind = 0;
        this.skill_id = -1;
        this.buff_id = -1;
        this.max_power = 0;
        this.buff_name = null;
        this.lv = 0;
    }
}

function setEventTrigger() {
    // 敵リストイベント
    $("#enemy_class").on("change", function (event) {
        let enemy_class = $(this).val();
        localStorage.setItem("enemy_class", enemy_class);
        localStorage.setItem("enemy_list", "1");
        createEnemyList(enemy_class);
    });
    $("#enemy_list").on("change", function (event) {
        localStorage.setItem("enemy_list", $(this).val());
        setEnemyStatus();
    });
    $('.enemy_type_value').on('input', function () {
        if (!isNaN(value)) {
            let value = $(this).val().replace(/[^\d]/g, '');
            let int_value = parseInt(value, 10);
            if (int_value < 0) {
                int_value = 0;
            } else if (int_value > 999) {
                int_value = 999;
            }
            $(this).val(int_value);
        }
    });
    $('.enemy_type_value').on('blur', function () {
        let value = parseInt($(this).val(), 10);
        if (isNaN(value)) {
            $(this).val('0');
        }
    });
    // 上書き確認
    $("#is_overwrite").on("change", function (event) {
        localStorage.setItem("is_overwrite", $(this).prop("checked"));
    });
    // 戦闘開始ボタンクリック
    $(".battle_start").on("click", function (event) {
        for (let i = 0; i < select_style_list.length; i++) {
            let style = select_style_list[i]?.style_info;
            if (NOT_USE_STYLE.includes(style?.style_id)) {
                let chara_data = getCharaData(style.chara_id);
                alert(`[${style.style_name}]${chara_data.chara_name}は現在使用できません。`);
                return;
            }
        };
        // 後衛が居る場合、前衛に空き不可
        const hasBlankFront = select_style_list.some(function (style, index) {
            return style === undefined && index <= 2
        });
        const hasBack = select_style_list.some(function (style, index) {
            return style !== undefined && index >= 3
        });
        if (hasBlankFront && hasBack) {
            alert("後衛がいるとき 前衛には3名必要です");
            return;
        }

        if ($("#is_overwrite").prop("checked")) {
            if ($("#battle_area").css("visibility") !== "hidden" && !confirm("現在の結果が消えますが、よろしいですか？")) {
                return;
            }
        }
        // 初期化
        turn_list = [];
        battle_enemy_info = getEnemyInfo();
        for (let i = 1; i <= 3; i++) {
            battle_enemy_info[`physical_${i}`] = Number($(`#enemy_physical_${i}`).val());
        }
        for (let i = 0; i <= 5; i++) {
            battle_enemy_info[`element_${i}`] = Number($(`#enemy_element_${i}`).val());
        }
        procBattleStart();
    });
}

// 敵リスト作成
function createEnemyList(enemy_class) {
    $("#enemy_list").empty();
    $.each(enemy_list, function (index, value) {
        if (value.enemy_class == enemy_class) {
            var option = $('<option>')
                .val(value.enemy_class_no);
            if (enemy_class == 6) {
                option.text(`#${value.sub_no} ${value.enemy_name}`)
            } else {
                option.text(value.enemy_name);
            }
            $("#enemy_list").append(option);
        }
    });
    setEnemyStatus();
}
// 敵ステータス設定
function setEnemyStatus() {
    let enemy_info = getEnemyInfo();
    if (enemy_info === undefined) {
        return;
    }
    for (let i = 1; i <= 3; i++) {
        setEnemyElement("#enemy_physical_" + i, enemy_info["physical_" + i]);
    }
    for (let i = 0; i <= 5; i++) {
        setEnemyElement("#enemy_element_" + i, enemy_info["element_" + i]);
    }
    $("#enemy_count").val(enemy_info.enemy_count);
}
// 敵耐性設定
function setEnemyElement(id, val) {
    $(id).val(val);
    $(id).removeClass("enemy_resist");
    $(id).removeClass("enemy_weak");
    if (val < 100) {
        $(id).addClass("enemy_resist");
    } else if (val > 100) {
        $(id).addClass("enemy_weak");
    }
}

/* 戦闘開始処理 */
function procBattleStart() {
    let turn_init = new turn_data();
    let unit_list = [];

    let init_sp_add = Number($("#init_sp_add").val());
    // スタイル情報を作成
    $.each(select_style_list, function (index, member_info) {
        if (index >= 6) {
            return false;
        }
        let unit = new unit_data();
        unit.place_no = index;
        if (member_info) {
            saveStyle(member_info);
            saveExclusionSkill(member_info);
            let physical = getCharaData(member_info.style_info.chara_id).physical;

            unit.style = member_info;
            unit.sp = member_info.init_sp;
            unit.sp += member_info.chain + init_sp_add;
            unit.normal_attack_element = member_info.bracelet;
            unit.earring_effect_size = member_info.earring;
            unit.skill_list = skill_list.filter(obj =>
                (obj.chara_id === member_info.style_info.chara_id || obj.chara_id === 0) &&
                (obj.style_id === member_info.style_info.style_id || obj.style_id === 0) &&
                obj.skill_active == 0 &&
                !member_info.exclusion_skill_list.includes(obj.skill_id)
            ).map(obj => {
                const copiedObj = JSON.parse(JSON.stringify(obj));
                if (copiedObj.chara_id === 0) {
                    copiedObj.chara_id === member_info.style_info.chara_id;
                    copiedObj.attack_physical = physical;
                }
                return copiedObj;
            });
            unit.passive_skill_list = skill_list.filter(obj =>
                obj.skill_active == 1 &&
                !member_info.exclusion_skill_list.includes(obj.skill_id)
            )
            unit.init_skill_id = 1;
            ["0", "00", "1", "3", "5", "10"].forEach(num => {
                if (member_info.style_info[`ability${num}`] && num <= member_info.limit_count) {
                    let ability_info = getAbilityInfo(member_info.style_info[`ability${num}`]);
                    switch (ability_info.activation_timing) {
                        case ABILIRY_BATTLE_START: // 戦闘開始時
                            unit.ability_battle_start.push(ability_info);
                            break;
                        case ABILIRY_SELF_START: // 自分のターン開始時
                            unit.ability_self_start.push(ability_info);
                            break;
                        case ABILIRY_ACTION_START: // 行動開始時
                            unit.ability_action_start.push(ability_info);
                            break;
                        case ABILIRY_ENEMY_START: // 敵ターン開始時
                            unit.ability_enemy_start.push(ability_info);
                            break;
                        case ABILIRY_ADDITIONALTURN: // 追加ターン
                            unit.ability_additional_turn.push(ability_info);
                            break;
                        case ABILIRY_OD_START: // オーバードライブ開始時
                            unit.ability_over_drive.push(ability_info);
                            break;
                        case ABILIRY_EX_SKILL_USE: // EXスキル使用時    
                            unit.ability_ex_skill_use.push(ability_info);
                            break;
                        case ABILIRY_RECEIVE_DAMAGE: // 被ダメージ時
                            unit.ability_receive_damage.push(ability_info);
                            break;
                        case ABILIRY_OTHER: // その他
                            if (ability_info.ability_id == 1520) {
                                // 蒼天
                                turn_init.sp_cost_down = ability_info.effect_size;
                            }
                            unit.ability_other.push(ability_info);
                            break;
                    }
                }
            });
            unit.style.passive_skill_list.forEach(skill_id => {
                let passive_info = getPassiveInfo(skill_id);
                if (!passive_info) {
                    return;
                }
                switch (passive_info.activation_timing) {
                    case ABILIRY_BATTLE_START: // 戦闘開始時
                        unit.ability_battle_start.push(passive_info);
                        break;
                    case ABILIRY_SELF_START: // 自分のターン開始時
                        unit.ability_self_start.push(passive_info);
                        break;
                    case ABILIRY_ACTION_START: // 行動開始時
                        unit.ability_action_start.push(passive_info);
                        break;
                    case ABILIRY_ENEMY_START: // 敵ターン開始時
                        unit.ability_enemy_start.push(passive_info);
                        break;
                    case ABILIRY_ADDITIONALTURN: // 追加ターン
                        unit.ability_additional_turn.push(passive_info);
                        break;
                    case ABILIRY_OD_START: // オーバードライブ開始時
                        unit.ability_over_drive.push(passive_info);
                        break;
                    case ABILIRY_EX_SKILL_USE: // EXスキル使用時    
                        unit.ability_ex_skill_use.push(passive_info);
                        break;
                    case ABILIRY_RECEIVE_DAMAGE: // 被ダメージ時
                        unit.ability_receive_damage.push(passive_info);
                        break;
                    case ABILIRY_OTHER: // その他
                        unit.ability_other.push(passive_info);
                        break;
                }
            });
        } else {
            unit.blank = true;
        }
        unit_list.push(unit);
    });

    // 初期設定を読み込み
    turn_init.field = Number($("#init_field").val());
    if (turn_init.field > 0) {
        turn_init.field_turn = -1;
    }
    turn_init.over_drive_gauge = Number($("#init_over_drive").val());
    turn_init.front_sp_add = Number($("#front_sp_add").val());
    turn_init.back_sp_add = Number($("#back_sp_add").val());
    turn_init.step_turn = Number($("#step_turn").val());
    turn_init.step_over_drive_down = Number($("#step_over_drive_down").val());
    turn_init.step_sp_down = Number($("#step_sp_down").val());

    turn_init.enemy_count = Number($("#enemy_count").val());;
    turn_init.unit_list = unit_list;

    // 戦闘開始アビリティ
    turn_init.abilityAction(ABILIRY_BATTLE_START);
    turn_init.user_operation.kb_action = KB_NEXT_ACTION;

    // バトルエリアリフレッシュ
    startBattle();

    // ターンを進める
    proceedTurn(turn_init);
}


// メンバー読み込み時の固有処理
function loadMember(select_chara_no, member_info) {
    loadExclusionSSkill(member_info)
}

// 除外スキルを保存
function saveExclusionSkill(member_info) {
    let style_id = member_info.style_info.style_id;
    localStorage.setItem(`exclusion_${style_id}`, member_info.exclusion_skill_list.join(","));
}

// 除外スキルを読み込む
function loadExclusionSSkill(member_info) {
    let style_id = member_info.style_info.style_id;
    let exclusion_skill_list = localStorage.getItem(`exclusion_${style_id}`);
    if (exclusion_skill_list) {
        member_info.exclusion_skill_list = exclusion_skill_list.split(",").map(Number);
    }
}

// ターンを進める
function proceedTurn(turn_data) {
    // ターン起動処理
    turn_data.unitSort();
    if (turn_data.additional_turn) {
        turn_data.turnProceed(KB_NEXT_ADDITIONALTURN);
        turn_data.abilityAction(ABILIRY_ADDITIONALTURN);
    } else {
        let kb_action = turn_data.user_operation.kb_action;
        turn_data.turnProceed(kb_action);
        if (kb_action == KB_NEXT_ACTION_OD) {
            turn_data.abilityAction(ABILIRY_OD_START);
        } else {
            turn_data.abilityAction(ABILIRY_ACTION_START);
        }
    }

    turn_list.push(turn_data);

    // 画面反映
    updateTurnList(turn_list);
}

// ターンを戻す
function returnTurn(turn_number) {
    // 指定されたnumber以上の要素を削除
    turn_list = turn_list.slice(0, turn_number);

    // 画面反映
    updateTurnList(turn_list);
}

// バフアイコン取得
function getBuffIconImg(buff_info) {
    let src = "img/";
    switch (buff_info.buff_kind) {
        case BUFF_ATTACKUP: // 攻撃力アップ
        case BUFF_ELEMENT_ATTACKUP: // 属性攻撃力アップ
            src += "IconBuffAttack";
            break;
        case BUFF_MINDEYE: // 心眼
            src += "IconMindEye";
            break;
        case BUFF_DEFENSEDOWN: // 防御力ダウン
        case BUFF_ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
            src += "IconBuffDefense";
            break;
        case BUFF_FRAGILE: // 脆弱
            src += "IconFragile";
            break;
        case BUFF_CRITICALRATEUP:	// クリティカル率アップ
        case BUFF_ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
            src += "IconCriticalRate";
            break;
        case BUFF_CRITICALDAMAGEUP:	// クリティカルダメージアップ
        case BUFF_ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
            src += "IconCriticalDamage";
            break;
        case BUFF_CHARGE: // チャージ
            src += "IconCharge";
            break;
        case BUFF_DAMAGERATEUP: // 破壊率アップ
            src += "IconDamageRate";
            break;
        case BUFF_FIGHTINGSPIRIT: // 闘志
            src += "IconFightingSpirit";
            break;
        case BUFF_MISFORTUNE: // 厄
            src += "IconMisfortune";
            break;
        case BUFF_FUNNEL: // 連撃
        case BUFF_ABILITY_FUNNEL: // アビリティ連撃
            src += "IconFunnel";
            break;
        case BUFF_DEFENSEDP: // DP防御ダウン
            src += "IconBuffDefenseDP";
            break;
        case BUFF_RESISTDOWN: // 耐性ダウン
            src += "IconResistElement";
            break;
        case BUFF_ETERNAL_DEFENSEDOWN: // 永続防御ダウン
        case BUFF_ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
            src += "IconBuffDefenseE";
            break;
        case BUFF_RECOIL: // 行動不能
            src += "IconRecoil";
            break;
        case BUFF_PROVOKE: // 挑発
            src += "IconTarget";
            break;
        case BUFF_COVER: // 注目
            src += "IconCover";
            break;
        case BUFF_GIVEATTACKBUFFUP: // バフ強化
            src += "IconGiveAttackBuffUp";
            break;
        case BUFF_GIVEDEBUFFUP: // デバフ強化
            src += "IconGiveDebuffUp";
            break;
        case BUFF_ARROWCHERRYBLOSSOMS: // 桜花の矢
            src += "IconArrowCherryBlossoms";
            break;
        case BUFF_ETERNAL_OARH: // 永遠なる誓い
            src += "iconEternalOath";
            break;
        case BUFF_EX_DOUBLE: // EXスキル連続使用
            src += "IconDoubleActionExtraSkill";
            break;
        case BUFF_BABIED: // オギャり
            src += "IconBabied";
            break;
        case BUFF_MORALE: // 士気
            src += "IconMorale";
            break;
        case BUFF_DIVA_BLESS: // 歌姫の加護
            src += "IconDivaBress";
            break;
        case BUFF_SHREDDING: // 速弾き
            src += "IconShredding";
            break;
        case BUFF_NAGATIVE: // ネガティブ
            src += "IconNegativeMind";
            break;
    }
    if (buff_info.buff_element != 0) {
        src += buff_info.buff_element;
    }
    src += ".webp";
    return src;
}

// 敵情報取得
function getEnemyInfo() {
    const enemy_class = Number($("#enemy_class option:selected").val());
    const enemy_class_no = Number($("#enemy_list option:selected").val());
    const filtered_enemy = enemy_list.filter((obj) => obj.enemy_class == enemy_class && obj.enemy_class_no === enemy_class_no);
    return filtered_enemy.length > 0 ? filtered_enemy[0] : undefined;
}
// ユニットデータ取得
function getUnitData(turn_data, index) {
    let unit_list = turn_data.unit_list;
    const filtered_unit = unit_list.filter((obj) => obj.place_no == index);
    return filtered_unit.length > 0 ? filtered_unit[0] : undefined;
}
// スキルデータ取得
function getSkillData(skill_id) {
    const filtered_skill = skill_list.filter((obj) => obj.skill_id == skill_id);
    return filtered_skill.length > 0 ? filtered_skill[0] : undefined;
}
// 攻撃情報取得
function getAttackInfo(attack_id) {
    const filtered_attack = skill_attack.filter((obj) => obj.attack_id == attack_id);
    return filtered_attack.length > 0 ? filtered_attack[0] : undefined;
}
// バフ情報取得
function getBuffInfo(skill_id) {
    const filtered_buff = skill_buff.filter((obj) => obj.skill_id == skill_id);
    return filtered_buff;
}
// アビリティ情報取得
function getAbilityInfo(ability_id) {
    const filtered_ability = ability_list.filter((obj) => obj.ability_id == ability_id);
    return filtered_ability.length > 0 ? filtered_ability[0] : undefined;
}

// パッシブ情報取得
function getPassiveInfo(skill_id) {
    const filtered_passive = skill_passive.filter((obj) => obj.skill_id == skill_id);
    return filtered_passive.length > 0 ? filtered_passive[0] : undefined;
}

// 行動開始
function startAction(turn_data) {
    // 追加ターンフラグ削除
    if (turn_data.additional_turn) {
        turn_data.additional_turn = false;
        turn_data.unitLoop(function (unit) {
            unit.additional_turn = false;
        });
    }
    // フィールド判定
    let old_field = turn_data.field;
    let select_field = turn_data.user_operation.field;
    if (old_field != select_field) {
        // 変更があった場合はフィールドターンをリセット
        turn_data.field_turn = 0;
    }

    let seq = sortActionSeq(turn_data);
    // 攻撃後に付与されるバフ種
    const ATTACK_AFTER_LIST = [BUFF_ATTACKUP, BUFF_ELEMENT_ATTACKUP, BUFF_CRITICALRATEUP, BUFF_CRITICALDAMAGEUP, BUFF_ELEMENT_CRITICALRATEUP,
        BUFF_ELEMENT_CRITICALDAMAGEUP, BUFF_CHARGE, BUFF_DAMAGERATEUP];
    $.each(seq, function (index, skill_data) {
        let skill_info = skill_data.skill_info;
        let unit_data = getUnitData(turn_data, skill_data.place_no);
        let attack_info;

        let buff_list = getBuffInfo(skill_info.skill_id);
        for (let i = 0; i < buff_list.length; i++) {
            let buff_info = buff_list[i];
            if (!(buff_info.skill_attack1 == 999 && ATTACK_AFTER_LIST.includes(buff_info.buff_kind))) {
                addBuffUnit(turn_data, buff_info, skill_data.place_no, unit_data);
            }
        }
        if (skill_info.skill_attribute == ATTRIBUTE_NORMAL_ATTACK) {
            attack_info = { "attack_id": 0, "attack_element": unit_data.normal_attack_element };
        } else if (skill_info.attack_id) {
            attack_info = getAttackInfo(skill_info.attack_id);
        }

        if (attack_info) {
            consumeBuffUnit(unit_data, attack_info, skill_info);
        }

        // EXスキル使用
        if (skill_info.skill_kind == 1 || skill_info.skill_kind == 2) {
            // アビリティ
            unit_data.abilityAction(turn_data, ABILIRY_EX_SKILL_USE);
            // EXスキル連続使用
            if (checkBuffExist(unit_data.buff_list, BUFF_EX_DOUBLE)) {
                for (let i = 0; i < buff_list.length; i++) {
                    let buff_info = buff_list[i];
                    if (!(buff_info.skill_attack1 == 999 && ATTACK_AFTER_LIST.includes(buff_info.buff_kind))) {
                        addBuffUnit(turn_data, buff_info, skill_data.place_no, unit_data);
                    }
                }
                if (attack_info) {
                    consumeBuffUnit(unit_data, attack_info, skill_info);
                }
                unit_data.buff_list = unit_data.buff_list.filter(obj => obj.buff_kind !== BUFF_EX_DOUBLE);
            }
        }

        // 攻撃後にバフを付与
        for (let i = 0; i < buff_list.length; i++) {
            let buff_info = buff_list[i];
            if (buff_info.skill_attack1 == 999 && ATTACK_AFTER_LIST.includes(buff_info.buff_kind)) {
                addBuffUnit(turn_data, buff_info, skill_data.place_no, unit_data);
            }
        }
        origin(turn_data, skill_info, unit_data);
        unit_data.payCost();
    });

    turn_data.over_drive_gauge += turn_data.add_over_drive_gauge;
    if (turn_data.over_drive_gauge > 300) {
        turn_data.over_drive_gauge = 300;
    }
    // 残りフィールドターン
    if (turn_data.field_turn > 1 && !turn_data.additional_turn) {
        turn_data.field_turn--;
    } else if (turn_data.field_turn == 1) {
        turn_data.field = 0;
    }
    turn_data.old_field = turn_data.field;
}

// 耐性判定
function isResist(physical, element, attack_id) {
    let physical_rate = battle_enemy_info[`physical_${physical}`];
    let element_rate = battle_enemy_info[`element_${element}`];
    if (PENETRATION_ATTACK_LIST.includes(attack_id)) {
        physical_rate = 400;
        element_rate = 100;
    }
    return physical_rate / 100 * element_rate / 100 >= 1;
}

// 弱点判定
function isWeak(physical, element, attack_id) {
    if (PENETRATION_ATTACK_LIST.includes(attack_id)) {
        return true;
    }
    let physical_rate = battle_enemy_info[`physical_${physical}`];
    let element_rate = battle_enemy_info[`element_${element}`];
    return physical_rate / 100 * element_rate / 100 > 1;
}

// 独自仕様
function origin(turn_data, skill_info, unit_data) {
    // 初回判定
    unit_data.use_skill_list.push(skill_info.skill_id);
    switch (skill_info.skill_id) {
        case 177: // エリミネイト・ポッシブル
            let target_unit_data = turn_data.unit_list.filter(unit => unit?.style?.style_info?.chara_id === unit_data.buff_target_chara_id);
            target_unit_data[0].next_turn_min_sp = 3;
            break;
    }
    return;
}

// 消費SP取得
function getSpCost(turn_data, skill_info, unit) {
    let sp_cost = skill_info.sp_cost;
    let sp_cost_down = turn_data.sp_cost_down
    if (harfSpSkill(turn_data, skill_info, unit)) {
        sp_cost = Math.ceil(sp_cost / 2);
    }
    if (ZeroSpSkill(turn_data, skill_info, unit)) {
        sp_cost = 0;
    }
    // 追加ターン
    if (turn_data.additional_turn) {
        // クイックリキャスト
        if (checkAbilityExist(unit.ability_other, 1506)) {
            sp_cost_down = 2;
        }
        // 優美なる剣舞
        if (checkAbilityExist(unit.ability_other, 1512)) {
            sp_cost_down = 2;
        }
        // 疾駆
        if (checkAbilityExist(unit.ability_other, 1515)) {
            sp_cost_down = 2;
        }
    }
    // オーバードライブ中
    if (turn_data.over_drive_max_turn > 0) {
        // 獅子に鰭
        if (checkAbilityExist(unit.ability_other, 1521)) {
            sp_cost_down = 2;
        }
    }
    // 歌姫の加護
    if (checkBuffExist(unit.buff_list, BUFF_DIVA_BLESS)) {
        // 絶唱
        if (checkAbilityExist(unit.ability_other, 1522)) {
            sp_cost_down = 2;
        }
    }
    // カラスの鳴き声で
    if (skill_info.skill_id == 578) {
        const count = unit.use_skill_list.filter(value => value === 578).length;
        sp_cost = 8 + 4 * count;
        sp_cost = sp_cost > 20 ? 20 : sp_cost;
    }
    sp_cost -= sp_cost_down;
    return sp_cost < 0 ? 0 : sp_cost;
}

// 消費SP半減
function harfSpSkill(turn_data, skill_info, unit_data) {
    // SP消費半減
    if (skill_info.skill_attribute == ATTRIBUTE_SP_HALF) {
        if (judgmentCondition(skill_info.attribute_conditions, turn_data, unit_data, skill_info.skill_id)) {
            return true;
        }
    }
    return false;
}

// 消費SP0
function ZeroSpSkill(turn_data, skill_info, unit_data) {
    // SP消費0
    if (skill_info.skill_attribute == ATTRIBUTE_SP_ZERO) {
        if (judgmentCondition(skill_info.attribute_conditions, turn_data, unit_data, skill_info.skill_id)) {
            return true;
        }
    }
    return false;
}

// 条件判定
function judgmentCondition(conditions, turn_data, unit_data, skill_id) {
    switch (conditions) {
        case CONDITIONS_FIRST_TURN: // 1ターン目
            return turn_data.turn_number == 1;
        case CONDITIONS_SKILL_INIT: // 初回
            return !unit_data.use_skill_list.includes(skill_id)
        case CONDITIONS_ADDITIONAL_TURN: // 追加ターン
            return turn_data.additional_turn;
        case CONDITIONS_DESTRUCTION_OVER_200: // 破壊率200%以上
        case CONDITIONS_BREAK: // ブレイク時
        case CONDITIONS_HAS_SHADOW: // 影分身
        case CONDITIONS_PERCENTAGE_30: // 確率30%
        case CONDITIONS_DOWN_TURN: // ダウンターン
        case CONDITIONS_BUFF_DISPEL: // バフ解除
            return unit_data.buff_effect_select_type == 1;
        case CONDITIONS_OVER_DRIVE: // オーバードライブ中
            return turn_data.over_drive_max_turn > 0;
        case CONDITIONS_DEFFENCE_DOWN: // 防御ダウン
            return checkBuffExist(turn_data.enemy_debuff_list, BUFF_DEFENSEDOWN);
        case CONDITIONS_FRAGILE: // 脆弱
            return checkBuffExist(turn_data.enemy_debuff_list, BUFF_FRAGILE);
        case CONDITIONS_TARGET_COVER: // 集中・挑発状態
            return checkBuffExist(turn_data.enemy_debuff_list, BUFF_PROVOKE) || checkBuffExist(turn_data.enemy_debuff_list, BUFF_COVER);
        case CONDITIONS_HAS_CHARGE: // チャージ
            return checkBuffExist(unit_data.buff_list, BUFF_CHARGE);
        case CONDITIONS_ENEMY_COUNT_1: // 敵1体
            return turn_data.enemy_count == 1;
        case CONDITIONS_ENEMY_COUNT_2: // 敵2体
            return turn_data.enemy_count == 2;
        case CONDITIONS_ENEMY_COUNT_3: // 敵3体
            return turn_data.enemy_count == 3;
        case CONDITIONS_31A_OVER_3: // 31A3人以上
            return checkMember(turn_data.unit_list, "31A") >= 3;
        case CONDITIONS_31E_OVER_3: // 31E3人以上
            return checkMember(turn_data.unit_list, "31E") >= 3;
        case CONDITIONS_FIELD_NOT_FIRE: // 火属性フィールド以外
            return turn_data.field != FIELD_FIRE && turn_data.field != FIELD_NORMAL;
        case CONDITIONS_DIVA_BLESS: // 歌姫の加護
            return checkBuffExist(unit_data.buff_list, BUFF_DIVA_BLESS);
        case CONDITIONS_NOT_DIVA_BLESS: // 歌姫の加護以外
            return !checkBuffExist(unit_data.buff_list, BUFF_DIVA_BLESS);
        case CONDITIONS_NOT_NEGATIVE: // ネガティブ以外
            return !checkBuffExist(unit_data.buff_list, BUFF_NAGATIVE);
    }
    return true;
}

function getFieldElement(turn_data) {
    let field_element = Number(turn_data.field);
    if (field_element == FIELD_RICE || field_element == FIELD_SANDSTORM) {
        field_element = 0;
    }
    return field_element;
}

// バフを追加
function addBuffUnit(turn_data, buff_info, place_no, use_unit_data) {
    // 条件判定
    if (buff_info.conditions != null) {
        if (!judgmentCondition(buff_info.conditions, turn_data, use_unit_data, buff_info.skill_id)) {
            return;
        }
    }

    // 個別判定
    switch (buff_info.buff_id) {
        // 選択されなかった
        case 2: // トリック・カノン(攻撃力低下)
            if (use_unit_data.buff_effect_select_type == 0) {
                return;
            }
            break;
    }
    switch (buff_info.skill_id) {
        case 557: // 極彩色
            let field_element = getFieldElement(turn_data);
            if (buff_info.buff_element != field_element) {
                return;
            }
            break;
    }

    let target_list;
    // 対象策定
    switch (buff_info.buff_kind) {
        case BUFF_ATTACKUP: // 攻撃力アップ
        case BUFF_ELEMENT_ATTACKUP: // 属性攻撃力アップ
        case BUFF_MINDEYE: // 心眼
        case BUFF_CRITICALRATEUP:	// クリティカル率アップ
        case BUFF_CRITICALDAMAGEUP:	// クリティカルダメージアップ
        case BUFF_ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
        case BUFF_ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
        case BUFF_CHARGE: // チャージ
        case BUFF_DAMAGERATEUP: // 破壊率アップ
        case BUFF_FUNNEL: // 連撃
        case BUFF_RECOIL: // 行動不能
        case BUFF_GIVEATTACKBUFFUP: // バフ強化
        case BUFF_GIVEDEBUFFUP: // デバフ強化
        case BUFF_ARROWCHERRYBLOSSOMS: // 桜花の矢
        case BUFF_ETERNAL_OARH: // 永遠なる誓い
        case BUFF_EX_DOUBLE: // EXスキル連続使用
        case BUFF_BABIED: // オギャり
        case BUFF_DIVA_BLESS: // 歌姫の加護
        case BUFF_SHREDDING: // 速弾き
            // バフ追加
            target_list = getTargetList(turn_data, buff_info.range_area, buff_info.target_element, place_no, use_unit_data.buff_target_chara_id);
            if (buff_info.buff_kind == BUFF_ATTACKUP || buff_info.buff_kind == BUFF_ELEMENT_ATTACKUP) {
                // 先頭のバフ強化を消費する。
                let index = use_unit_data.buff_list.findIndex(function (buff_info) {
                    return buff_info.buff_kind == BUFF_GIVEATTACKBUFFUP;
                });
                if (index !== -1) {
                    use_unit_data.buff_list.splice(index, 1);
                }
            }
            $.each(target_list, function (index, target_no) {
                let unit_data = getUnitData(turn_data, target_no);
                // 単一バフ
                if (SINGLE_BUFF_LIST.includes(buff_info.buff_kind)) {
                    if (checkBuffExist(unit_data.buff_list, buff_info.buff_kind)) {
                        if (buff_info.effect_count > 0) {
                            // 残ターン更新
                            let filter_list = unit_data.buff_list.filter(function (buff) {
                                return buff.buff_kind == buff_info.buff_kind;
                            })
                            filter_list[0].rest_turn = buff_info.effect_count;
                        }
                        return true;
                    }
                }
                if (ALONE_ACTIVATION_BUFF_LIST.includes(buff_info.buff_id)) {
                    if (checkBuffIdExist(unit_data.buff_list, buff_info.buff_id)) {
                        if (buff_info.effect_count > 0) {
                            // 残ターン更新
                            let filter_list = unit_data.buff_list.filter(function (buff) {
                                return buff.buff_id == buff_info.buff_id;
                            })
                            filter_list[0].rest_turn = buff_info.effect_count;
                        }
                        return true;
                    }
                }
                let buff = createBuffData(buff_info, use_unit_data);
                unit_data.buff_list.push(buff);
            });
            break;
        case BUFF_MORALE: // 士気
            // バフ追加
            target_list = getTargetList(turn_data, buff_info.range_area, buff_info.target_element, place_no, use_unit_data.buff_target_chara_id);
            $.each(target_list, function (index, target_no) {
                let unit_data = getUnitData(turn_data, target_no);
                let exist_list = unit_data.buff_list.filter(function (buff_info) {
                    return buff_info.buff_kind == BUFF_MORALE;
                });
                let buff;
                if (exist_list.length > 0) {
                    buff = exist_list[0];
                } else {
                    buff = createBuffData(buff_info, use_unit_data);
                    unit_data.buff_list.push(buff);
                }
                if (buff.lv < 10) {
                    buff.lv += buff_info.effect_size;
                }
            });
            break;
        case BUFF_DEFENSEDOWN: // 防御力ダウン
        case BUFF_ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
        case BUFF_FRAGILE: // 脆弱
        case BUFF_DEFENSEDP: // DP防御力ダウン
        case BUFF_RESISTDOWN: // 耐性ダウン
        case BUFF_ETERNAL_DEFENSEDOWN: // 永続防御ダウン
        case BUFF_ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
        case BUFF_PROVOKE: // 挑発
        case BUFF_COVER: // 注目
            // デバフ追加
            let add_count = 1;
            if (buff_info.range_area == RANGE_ENEMY_ALL) {
                add_count = turn_data.enemy_count;
            }
            // デバフ強化を消費する。
            let index = use_unit_data.buff_list.findIndex(function (buff_info) {
                return buff_info.buff_kind == BUFF_GIVEDEBUFFUP || buff_info.buff_kind == BUFF_ARROWCHERRYBLOSSOMS;
            });
            if (index !== -1) {
                use_unit_data.buff_list.splice(index, 1);
            }
            for (let i = 0; i < add_count; i++) {
                let debuff = createBuffData(buff_info, use_unit_data);
                turn_data.enemy_debuff_list.push(debuff);
            }
            break;
        case BUFF_HEALSP: // SP追加
            target_list = getTargetList(turn_data, buff_info.range_area, buff_info.target_element, place_no, use_unit_data.buff_target_chara_id);
            $.each(target_list, function (index, target_no) {
                let unit_data = getUnitData(turn_data, target_no);
                let unit_sp = unit_data.sp;
                unit_sp += buff_info.min_power;
                let limit_sp = buff_info.max_power;
                if (unit_sp + unit_data.over_drive_sp - unit_data.sp_cost > limit_sp) {
                    unit_sp = limit_sp - unit_data.over_drive_sp + unit_data.sp_cost;
                }
                if (unit_sp < unit_data.sp) {
                    unit_sp = unit_data.sp
                }
                unit_data.sp = unit_sp;
            });
            break;
        case BUFF_ADDITIONALTURN: // 追加ターン
            target_list = getTargetList(turn_data, buff_info.range_area, buff_info.target_element, place_no, use_unit_data.buff_target_chara_id);
            $.each(target_list, function (index, target_no) {
                let unit_data = getUnitData(turn_data, target_no);
                unit_data.additional_turn = true;
            });
            turn_data.additional_turn = true;
            break;
        case BUFF_FIELD: // フィールド
            turn_data.field = buff_info.buff_element;
            let field_turn = buff_info.effect_count;
            if (field_turn > 0) {
                // 天長地久
                if (checkAbilityExist(use_unit_data.ability_other, 603)) {
                    field_turn = 0;
                }
                // メディテーション
                if (checkPassiveExist(use_unit_data.style.passive_skill_list, 501)) {
                    field_turn = 0;
                }
            }
            turn_data.field_turn = field_turn;
            break;
        case BUFF_DISPEL: // ディスペル
            target_list = getTargetList(turn_data, buff_info.range_area, buff_info.target_element, place_no, use_unit_data.buff_target_chara_id);
            $.each(target_list, function (index, target_no) {
                let unit_data = getUnitData(turn_data, target_no);
                unit_data.buff_list = unit_data.buff_list.filter(function (buff_info) {
                    return buff_info.buff_kind != BUFF_RECOIL && buff_info.buff_kind != BUFF_NAGATIVE;
                });
            });
            break;
        default:
            break;
    }
}

function createBuffData(buff_info, use_unit_data) {
    let buff = new buff_data();
    buff.buff_kind = buff_info.buff_kind;
    buff.buff_element = buff_info.buff_element;
    buff.effect_size = buff_info.effect_size;
    buff.effect_count = buff_info.effect_count;
    buff.buff_name = buff_info.buff_name
    buff.skill_id = buff_info.skill_id;
    buff.buff_id = buff_info.buff_id;
    buff.max_power = buff_info.max_power;
    buff.rest_turn = buff_info.effect_count == 0 ? -1 : buff_info.effect_count;
    switch (buff_info.buff_kind) {
        case BUFF_DEFENSEDOWN: // 防御力ダウン
        case BUFF_ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
        case BUFF_FRAGILE: // 脆弱
        case BUFF_DEFENSEDP: // DP防御力ダウン 
            // ダブルリフト
            if (checkAbilityExist(use_unit_data.ability_other, 1516)) {
                buff.rest_turn++;
            }
            break;
        case BUFF_FUNNEL: // 連撃
            buff.effect_sum = buff_info.effect_size * buff_info.max_power;
            break;
    }
    return buff;
}

// 攻撃時にバフ消費
function consumeBuffUnit(unit_data, attack_info, skill_info) {
    let consume_kind = [];
    let consume_count = 2
    if (skill_info.attack_id) {
        // 連撃消費
        unit_data.getFunnelList();
    }
    // バフ消費
    let buff_list = unit_data.buff_list;
    for (let i = buff_list.length - 1; i >= 0; i--) {
        buff_info = buff_list[i];
        const countWithFilter = consume_kind.filter(buff_kind => buff_kind === buff_info.buff_kind).length;
        if (buff_info.rest_turn > 0) {
            // 残ターンバフは現状単独発動のみ
            for (j = 0; j < consume_count; j++) {
                consume_kind.push(buff_info.buff_kind);
            }
            continue;
        }
        // 同一バフは制限
        if (countWithFilter < consume_count) {
            switch (buff_info.buff_kind) {
                case BUFF_ELEMENT_ATTACKUP: // 属性攻撃力アップ
                    if (attack_info.attack_element != buff_info.buff_element) {
                        continue;
                    }
                case BUFF_ATTACKUP: // 攻撃力アップ
                case BUFF_MINDEYE: // 心眼
                case BUFF_CHARGE: // チャージ
                case BUFF_DAMAGERATEUP: // 破壊率アップ
                case BUFF_ARROWCHERRYBLOSSOMS: // 桜花の矢
                    // スキルでのみ消費
                    if (attack_info.attack_id == 0) {
                        continue;
                    }
                    if (buff_info.buff_kind == BUFF_MINDEYE) {
                        // 弱点のみ消費
                        let physical = getCharaData(unit_data.style.style_info.chara_id).physical;
                        if (!isWeak(physical, attack_info.attack_element, attack_info.attack_id)) {
                            continue;
                        }
                    }
                    buff_list.splice(i, 1);
                    break;
                case BUFF_ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
                case BUFF_ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
                    if (attack_info.attack_element != buff_info.buff_element) {
                        continue;
                    }
                case BUFF_CRITICALRATEUP:	// クリティカル率アップ
                case BUFF_CRITICALDAMAGEUP:	// クリティカルダメージアップ
                    // 通常攻撃でも消費
                    buff_list.splice(i, 1);
                    // 星屑の航路は消費しない。
                    if (buff_info.skill_id == 67 || buff_info.skill_id == 491) {
                        continue;
                    }
                    break;
                default:
                    // 上記以外のバフ消費しない
                    break;
            }
            consume_kind.push(buff_info.buff_kind);
        }
    };
}

// バフ名称取得
function getBuffKindName(buff_info) {
    let buff_kind_name = "";
    if (buff_info.buff_element != 0) {
        buff_kind_name = element_name[buff_info.buff_element] + "属性";
    }

    switch (buff_info.buff_kind) {
        case BUFF_ATTACKUP: // 攻撃力アップ
        case BUFF_ELEMENT_ATTACKUP: // 属性攻撃力アップ
            buff_kind_name += "攻撃力アップ";
            break;
        case BUFF_MINDEYE: // 心眼
            buff_kind_name += "心眼";
            break;
        case BUFF_DEFENSEDOWN: // 防御力ダウン
        case BUFF_ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
            buff_kind_name += "防御力ダウン";
            break;
        case BUFF_FRAGILE: // 脆弱
            buff_kind_name += "脆弱";
            break;
        case BUFF_CRITICALRATEUP:	// クリティカル率アップ
        case BUFF_ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
            buff_kind_name += "クリティカル率アップ";
            break;
        case BUFF_CRITICALDAMAGEUP:	// クリティカルダメージアップ
        case BUFF_ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
            buff_kind_name += "クリティカルダメージアップ";
            break;
        case BUFF_CHARGE: // チャージ
            buff_kind_name += "チャージ";
            break;
        case BUFF_DAMAGERATEUP: // 破壊率アップ
            buff_kind_name += "破壊率アップ";
            break;
        case BUFF_FIGHTINGSPIRIT: // 闘志
            buff_kind_name += "闘志";
            break;
        case BUFF_MISFORTUNE: // 厄
            buff_kind_name += "厄";
            break;
        case BUFF_FUNNEL: // 連撃
        case BUFF_ABILITY_FUNNEL: // アビリティ連撃
            switch (buff_info.effect_size) {
                case 10:
                    buff_kind_name += "連撃(小)";
                    break
                case 20:
                    buff_kind_name += "連撃(中)";
                    break
                case 40:
                    buff_kind_name += "連撃(大)";
                    break
                case 80:
                    buff_kind_name += "連撃(特大)";
                    break
            }
            break;
        case BUFF_DEFENSEDP: // DP防御力ダウン
            buff_kind_name += "DP防御力ダウン";
            break;
        case BUFF_RESISTDOWN: // 耐性ダウン
            buff_kind_name += "耐性打ち消し/ダウン";
            break;
        case BUFF_ETERNAL_DEFENSEDOWN: // 永続防御ダウン
        case BUFF_ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
            buff_kind_name += "防御力ダウン";
            break;
        case BUFF_RECOIL: // 行動不能
            buff_kind_name += "行動不能";
            break;
        case BUFF_PROVOKE: // 挑発
            buff_kind_name += "挑発";
            break;
        case BUFF_COVER: // 注目
            buff_kind_name += "注目";
            break;
        case BUFF_GIVEATTACKBUFFUP: // バフ強化
            buff_kind_name += "バフ強化";
            break;
        case BUFF_GIVEDEBUFFUP: // デバフ強化
            buff_kind_name += "デバフ強化";
            break;
        case BUFF_ARROWCHERRYBLOSSOMS: // 桜花の矢
            buff_kind_name += "桜花の矢";
            break;
        case BUFF_ETERNAL_OARH: // 永遠なる誓い
            buff_kind_name += "永遠なる誓い";
            break;
        case BUFF_EX_DOUBLE: // EXスキル連続使用
            buff_kind_name += "EXスキル連続使用";
            break;
        case BUFF_BABIED: // オギャり
            buff_kind_name += "オギャり";
            break;
        case BUFF_MORALE: // 士気
            buff_kind_name += "士気";
            break;
        case BUFF_DIVA_BLESS: // 歌姫の加護
            buff_kind_name += "歌姫の加護";
            break;
        case BUFF_SHREDDING: // 速弾き
            buff_kind_name += "速弾き";
            break;
        case BUFF_NAGATIVE: // ネガティブ
            buff_kind_name += "ネガティブ";
            break;
        default:
            break;
    }
    return buff_kind_name;
}


// ターゲットリスト追加
function getTargetList(turn_data, range_area, target_element, place_no, buff_target_chara_id) {
    let target_list = [];
    let target_unit_data;
    switch (range_area) {
        case RANGE_FIELD: // 場
            break;
        case RANGE_ENEMY_UNIT: // 敵単体
            break;
        case RANGE_ENEMY_ALL: // 敵全体
            break;
        case RANGE_ALLY_UNIT: // 味方単体
            target_unit_data = turn_data.unit_list.filter(unit => unit?.style?.style_info?.chara_id === buff_target_chara_id);
            target_list.push(target_unit_data[0].place_no);
            break;
        case RANGE_ALLY_FRONT: // 味方前衛
            target_list = [0, 1, 2];
            break;
        case RANGE_ALLY_BACK: // 味方後衛
            target_list = [3, 4, 5];
            break;
        case RANGE_ALLY_ALL: // 味方全員
            target_list = [...Array(6).keys()];
            break;
        case RANGE_SELF: // 自分
            target_list.push(place_no);
            break;
        case RANGE_SELF_OTHER: // 自分以外
            target_list = [...Array(6).keys()].filter(num => num !== place_no);
            break;
        case RANGE_SELF_AND_UNIT: // 味方単体
            target_unit_data = turn_data.unit_list.filter(unit => unit?.style?.style_info?.chara_id === buff_target_chara_id);
            target_list.push(place_no);
            target_list.push(target_unit_data[0].place_no);
            break;
        case RANGE_31C_MEMBER: // 31Cメンバー
            target_list = getTargetPlaceList(turn_data.unit_list, CHARA_ID_31C);
            break;
        case RANGE_31E_MEMBER: // 31Eメンバー
            target_list = getTargetPlaceList(turn_data.unit_list, CHARA_ID_31E);
            break;
        case CHARA_ID_MARUYAMA: // 丸山部隊メンバー
            target_list = getTargetPlaceList(turn_data.unit_list, CHARA_ID_MARUYAMA);
            break;
        default:
            break;
    }
    if (target_element != 0) {
        for (let i = target_list.length - 1; i >= 0; i--) {
            let unit = getUnitData(turn_data, target_list[i]);
            if (unit.blank || (unit.style.style_info.element != target_element && unit.style.style_info.element2 != target_element)) {
                target_list.splice(i, 1);
            }
        }
    }
    return target_list;
}

// メンバーリスト作成
function getTargetPlaceList(unit_list, member_id_list) {
    return member_id_list.reduce((acc, member_id) => {
        const place_no = charaIdToPlaceNo(unit_list, member_id);
        if (place_no !== null) { // nullを除外
            acc.push(place_no);
        }
        return acc;
    }, []);
}
// キャラIDから場所番号を取得
function charaIdToPlaceNo(unit_list, member_id) {
    for (let unit of unit_list) {
        if (unit.style?.style_info?.chara_id == member_id) {
            return unit.place_no;
        }
    }
    return null;
}

// 行動順を取得
const sortActionSeq = (turn_data) => {
    let buff_seq = [];
    let attack_seq = [];

    // 前衛のスキルを取得
    turn_data.unit_list.forEach((unit, index) => {
        let skill_id = unit.select_skill_id;
        let place_no = unit.place_no;
        if (skill_id == 0 || 3 <= place_no) {
            return true;
        }
        let skill_info = getSkillData(skill_id);
        let skill_data = {
            skill_info: skill_info,
            place_no: place_no
        };
        if (skill_info.attack_id || skill_info.skill_attribute == ATTRIBUTE_NORMAL_ATTACK) {
            attack_seq.push(skill_data);
        } else {
            buff_seq.push(skill_data);
        }
    });
    // バフとアタックの順序を結合
    return buff_seq.concat(attack_seq);
}