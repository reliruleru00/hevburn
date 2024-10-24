/** バフ種別 */
const BUFF_ATTACKUP = 0; // 攻撃力アップ
const BUFF_ELEMENT_ATTACKUP = 1; // 属性アップ
const BUFF_MINDEYE = 2; // 心眼
const BUFF_DEFENSEDOWN = 3; // 防御ダウン
const BUFF_ELEMENT_DEFENSEDOWN = 4; // 属性防御ダウン
const BUFF_FRAGILE = 5; // 脆弱
const BUFF_CRITICALRATEUP = 6; // クリ率
const BUFF_CRITICALDAMAGEUP = 7; // クリダメ
const BUFF_ELEMENT_CRITICALRATEUP = 8; // 属性クリ率
const BUFF_ELEMENT_CRITICALDAMAGEUP = 9; // 属性クリダメ
const BUFF_CHARGE = 10;// チャージ
const BUFF_FIELD = 11; // フィールド
const BUFF_DAMAGERATEUP = 12; // 破壊率アップ
const BUFF_OVERDRIVEPOINTUP = 13; // OD増加
const BUFF_FIGHTINGSPIRIT = 14; // 闘志
const BUFF_MISFORTUNE = 15; // 厄
const BUFF_FUNNEL_SMALL = 16; // 連撃(小)
const BUFF_FUNNEL_LARGE = 17; // 連撃(大)
const BUFF_STRONG_BREAK = 18; // 強ブレイク
const BUFF_DEFENSEDP = 19; // DP防御ダウン
const BUFF_RESISTDOWN = 20; // 耐性ダウン
const BUFF_ETERNAL_DEFENSEDOWN = 21; // 永続防御力ダウン
const BUFF_ELEMENT_ETERNAL_DEFENSEDOWN = 22; // 永続属性防御ダウン
const BUFF_HEALSP = 23; // SP増加
const BUFF_RECOIL = 24; // 行動不能
const BUFF_PROVOKE = 25; // 挑発
const BUFF_ADDITIONALTURN = 26 // 追加ターン
const BUFF_COVER = 27; // 注目
const BUFF_GIVEATTACKBUFFUP = 28; // バフ強化
const BUFF_GIVEDEBUFFUP = 29; // デバフ強化
const BUFF_ARROWCHERRYBLOSSOMS = 30; // 桜花の矢
const BUFF_ETERNAL_OARH = 31; // 永遠なる誓い
const BUFF_EX_DOUBLE = 32; // EXスキル連続発動
const BUFF_BABIED = 33; // オギャり
const BUFF_MORALE = 34; // 士気
const BUFF_ABILITY_FUNNEL_SMALL = 116; // アビリティ連撃(小)
const BUFF_ABILITY_FUNNEL_LARGE = 117; // アビリティ連撃(大)

/** 対象 */
const RANGE_FILED = 0; // 場
const RANGE_ENEMY_UNIT = 1; // 敵単体
const RANGE_ENEMY_ALL = 2; // 敵全体
const RANGE_ALLY_UNIT = 3; // 味方単体
const RANGE_ALLY_FRONT = 4; // 味方前衛
const RANGE_ALLY_BACK = 5; // 味方後衛
const RANGE_ALLY_ALL = 6; // 味方全員
const RANGE_SELF = 7; // 自分
const RANGE_SELF_OTHER = 8; // 自分以外
const RANGE_SELF_AND_UNIT = 9; // 自分と味方単体

/** スキル属性 */
const ATTRIBUTE_NORMAL_ATTACK = 1; // 通常攻撃
const ATTRIBUTE_PURSUIT = 2; // 追撃
const ATTRIBUTE_SP_HALF = 11; // SP半減
/** 条件 */
const CONDITIONS_FIRST_TURN = 1; // 1ターン目
const CONDITIONS_SKILL_INIT = 2; // 初回
const CONDITIONS_ADDITIONAL_TURN = 3; // 追加ターン
const CONDITIONS_OVER_DRIVE = 4; // オーバードライブ中
const CONDITIONS_DESTRUCTION_OVER_200 = 5; // 破壊率200%以上
const CONDITIONS_DEFFENCE_DOWN = 11; // 防御ダウン中
const CONDITIONS_FRAGILE = 12; // 脆弱中
const CONDITIONS_TARGET_COVER = 13; // 集中・挑発状態
const CONDITIONS_HAS_CHARGE = 21; // チャージ中
const CONDITIONS_31A_OVER_3 = 31; // 31A3人以上
const CONDITIONS_31E_OVER_3 = 35; // 31E3人以上
const CONDITIONS_ENEMY_COUNT_1 = 51; // 敵1体
const CONDITIONS_ENEMY_COUNT_2 = 52; // 敵2体
const CONDITIONS_ENEMY_COUNT_3 = 53; // 敵3体

/** 敵リスト*/
const ENEMY_CLASS_HARD_LAYER = 1; // 異時層
const ENEMY_CLASS_ORB_BOSS = 2; // オーブボス
const ENEMY_CLASS_CLOCK_TOWER_NORMAL = 3; // 時計塔(N)
const ENEMY_CLASS_CLOCK_TOWER_HARD = 4; // 時計塔(H)
const ENEMY_CLASS_JEWEL_LABYRINTH = 5; // 宝珠の迷宮
const ENEMY_CLASS_SCORE_ATTACK = 6; // スコアアタック
const ENEMY_CLASS_PRISMATIC_BATTLE = 7; // プリズムバトル
const ENEMY_CLASS_STELLAR_SWEEP_FRONT = 8; // 恒星掃戦線
const ENEMY_CLASS_EVENT_HIDDEN_BOSS = 9; // イベント隠しボス
const ENEMY_CLASS_TIME_TRAINING = 10; // 時の修練場
const ENEMY_CLASS_CONTROL_BATTLE = 11; // 制圧戦
const ENEMY_CLASS_FREE_INPUT = 99; // 自由入力
