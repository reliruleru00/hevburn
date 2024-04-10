﻿let ability_list = [
    {"ability_id":1,"ability_name":"灼熱の陣","ability_explan":"バトル開始時前衛にいると火属性強化フィールド(弱)を展開","ability_short_explan":"火属性強化フィールド(弱)を展開","activation_timing":0,"activation_place":1,"conditions":"","ability_target":6,"ability_physical":0,"ability_element":1,"effect_type":7,"effect_size":20,"effect_count":null},
    {"ability_id":2,"ability_name":"凍れる陣","ability_explan":"バトル開始時前衛にいると氷属性強化フィールド(弱)を展開","ability_short_explan":"氷属性強化フィールド(弱)を展開","activation_timing":0,"activation_place":1,"conditions":"","ability_target":6,"ability_physical":0,"ability_element":2,"effect_type":7,"effect_size":20,"effect_count":null},
    {"ability_id":3,"ability_name":"雷鳴の陣","ability_explan":"バトル開始時前衛にいると雷属性強化フィールド(弱)を展開","ability_short_explan":"雷属性強化フィールド(弱)を展開","activation_timing":0,"activation_place":1,"conditions":"","ability_target":6,"ability_physical":0,"ability_element":3,"effect_type":7,"effect_size":20,"effect_count":null},
    {"ability_id":4,"ability_name":"栄光の陣","ability_explan":"バトル開始時前衛にいると光属性強化フィールド(弱)を展開","ability_short_explan":"光属性強化フィールド(弱)を展開","activation_timing":0,"activation_place":1,"conditions":"","ability_target":6,"ability_physical":0,"ability_element":4,"effect_type":7,"effect_size":20,"effect_count":null},
    {"ability_id":5,"ability_name":"闇夜の陣","ability_explan":"バトル開始時前衛にいると闇属性強化フィールド(弱)を展開","ability_short_explan":"闇属性強化フィールド(弱)を展開","activation_timing":0,"activation_place":1,"conditions":"","ability_target":6,"ability_physical":0,"ability_element":5,"effect_type":7,"effect_size":20,"effect_count":null},
    {"ability_id":6,"ability_name":"狂乱の型","ability_explan":"バトル開始時前衛にいると自身の連撃数(大ダメージ)+3(1回)","ability_short_explan":"連撃数(大ダメージ)+3","activation_timing":0,"activation_place":1,"conditions":"回数制限","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":6,"effect_size":40,"effect_count":3},
    {"ability_id":7,"ability_name":"五月雨","ability_explan":"バトル開始時前衛にいると自身の連撃数(小ダメージ)+5(1回)","ability_short_explan":"連撃数(小ダメージ)+5","activation_timing":0,"activation_place":1,"conditions":"回数制限","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":6,"effect_size":10,"effect_count":5},
    {"ability_id":8,"ability_name":"洞察","ability_explan":"バトル開始時前衛にいると自身のクリティカル率+20%(3ターン)","ability_short_explan":"クリティカル率+20%(3ターン)","activation_timing":0,"activation_place":1,"conditions":"ターン制限","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":3,"effect_size":20,"effect_count":3},
    {"ability_id":9,"ability_name":"疾風","ability_explan":"バトル開始時前衛にいるとスキル攻撃力+15%(3ターン)","ability_short_explan":"スキル攻撃力+15%(3ターン)","activation_timing":0,"activation_place":1,"conditions":"ターン制限","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":15,"effect_count":3},
    {"ability_id":10,"ability_name":"烈風","ability_explan":"バトル開始時前衛にいると自身のスキル攻撃力+30%(1ターン)","ability_short_explan":"スキル攻撃力+30%(1ターン)","activation_timing":0,"activation_place":1,"conditions":"ターン制限","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":30,"effect_count":1},
    {"ability_id":11,"ability_name":"火炎の極意","ability_explan":"バトル開始時火属性スタイルが3体以上のとき味方全員の火属性スキル攻撃力+30%(重複不可)","ability_short_explan":"火属性スタイルが3体以上のとき 火属性スキル攻撃力+30%","activation_timing":0,"activation_place":3,"conditions":"火属性スタイルが3体以上","ability_target":4,"ability_physical":0,"ability_element":1,"effect_type":1,"effect_size":30,"effect_count":0},
    {"ability_id":200,"ability_name":"万物の強威","ability_explan":"行動開始時に前衛にいると自身のスキル攻撃力+20%","ability_short_explan":"スキル攻撃力+20%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":20,"effect_count":1},
    {"ability_id":201,"ability_name":"火の強威","ability_explan":"行動開始時に前衛にいると自身の火属性のスキル攻撃力+25%","ability_short_explan":"火属性のスキル攻撃力+25%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":1,"effect_type":1,"effect_size":25,"effect_count":1},
    {"ability_id":202,"ability_name":"氷の強威","ability_explan":"行動開始時に前衛にいると自身の氷属性のスキル攻撃力+25%","ability_short_explan":"氷属性のスキル攻撃力+25%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":2,"effect_type":1,"effect_size":25,"effect_count":1},
    {"ability_id":203,"ability_name":"雷の強威","ability_explan":"行動開始時に前衛にいると自身の雷属性のスキル攻撃力+25%","ability_short_explan":"雷属性のスキル攻撃力+25%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":3,"effect_type":1,"effect_size":25,"effect_count":1},
    {"ability_id":204,"ability_name":"光の強威","ability_explan":"行動開始時に前衛にいると自身の光属性のスキル攻撃力+25%","ability_short_explan":"光属性のスキル攻撃力+25%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":4,"effect_type":1,"effect_size":25,"effect_count":1},
    {"ability_id":205,"ability_name":"闇の強威","ability_explan":"行動開始時に前衛にいると自身の闇属性のスキル攻撃力+25%","ability_short_explan":"闇属性のスキル攻撃力+25%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":5,"effect_type":1,"effect_size":25,"effect_count":1},
    {"ability_id":206,"ability_name":"星空","ability_explan":"行動開始時前衛にいるとチームのクリティカル率+10%","ability_short_explan":"クリティカル率+10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":3,"effect_size":10,"effect_count":1},
    {"ability_id":207,"ability_name":"英雄の凱歌","ability_explan":"行動開始時前衛にいるとチームのスキル攻撃力+10%","ability_short_explan":"スキル攻撃力+10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":10,"effect_count":1},
    {"ability_id":208,"ability_name":"怒涛","ability_explan":"行動開始時前衛にいると自身のクリティカルダメージ+30%","ability_short_explan":"クリティカルダメージ+30%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":3,"effect_size":30,"effect_count":1},
    {"ability_id":209,"ability_name":"技巧","ability_explan":"行動開始時前衛にいると自身のクリティカル率+30%","ability_short_explan":"クリティカル率+30%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":4,"effect_size":30,"effect_count":1},
    {"ability_id":210,"ability_name":"高揚","ability_explan":"行動開始時前衛にいるとトークン1つにつき攻撃力+5%","ability_short_explan":"トークン1つにつき 攻撃力+5%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":31,"effect_size":5,"effect_count":1},
    {"ability_id":211,"ability_name":"野生の勘","ability_explan":"行動開始時前衛にいると確率でスキル攻撃力+30%","ability_short_explan":"確率で スキル攻撃力+30%","activation_timing":1,"activation_place":1,"conditions":"確率30%","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":30,"effect_count":1},
    {"ability_id":212,"ability_name":"勇猛","ability_explan":"行動開始時に前衛&DP100%以上のとき自身のスキル攻撃力+30%","ability_short_explan":"DP100%以上のときスキル攻撃力+30%","activation_timing":1,"activation_place":1,"conditions":"DP100%以上","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":30,"effect_count":1},
    {"ability_id":213,"ability_name":"陽動作戦","ability_explan":"行動開始時に前衛&DP30%以下のとき前衛のスキル攻撃力+30%","ability_short_explan":"DP30%以下のときスキル攻撃力+30%","activation_timing":1,"activation_place":1,"conditions":"DP30%以下","ability_target":2,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":30,"effect_count":1},
    {"ability_id":214,"ability_name":"壮烈","ability_explan":"行動開始時に前衛&DP80%以上のとき自身のスキル攻撃力+20%","ability_short_explan":"DP80%以上のときスキル攻撃力+20%","activation_timing":1,"activation_place":1,"conditions":"DP80％以上","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":20,"effect_count":1},
    {"ability_id":215,"ability_name":"火の采配","ability_explan":"行動開始時に前衛&DP80%以上のとき前衛の氷属性のスキル攻撃力+18%","ability_short_explan":"DP80%以上のとき火属性のスキル攻撃力+18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":2,"ability_physical":0,"ability_element":1,"effect_type":1,"effect_size":18,"effect_count":1},
    {"ability_id":216,"ability_name":"氷の采配","ability_explan":"行動開始時に前衛&DP80%以上のとき前衛の氷属性のスキル攻撃力+18%","ability_short_explan":"DP80%以上のとき氷属性のスキル攻撃力+18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":2,"ability_physical":0,"ability_element":2,"effect_type":1,"effect_size":18,"effect_count":1},
    {"ability_id":217,"ability_name":"雷の采配","ability_explan":"行動開始時に前衛&DP80%以上のとき前衛の雷属性のスキル攻撃力+18%","ability_short_explan":"DP80%以上のとき雷属性のスキル攻撃力+18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":2,"ability_physical":0,"ability_element":3,"effect_type":1,"effect_size":18,"effect_count":1},
    {"ability_id":218,"ability_name":"光の采配","ability_explan":"行動開始時に前衛&DP80%以上のとき前衛の光属性のスキル攻撃力+18%","ability_short_explan":"DP80%以上のとき光属性のスキル攻撃力+18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":2,"ability_physical":0,"ability_element":4,"effect_type":1,"effect_size":18,"effect_count":1},
    {"ability_id":219,"ability_name":"闇の采配","ability_explan":"行動開始時に前衛&DP80%以上のとき前衛の光属性のスキル攻撃力+18%","ability_short_explan":"DP80%以上のとき光属性のスキル攻撃力+18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":2,"ability_physical":0,"ability_element":5,"effect_type":1,"effect_size":18,"effect_count":1},
    {"ability_id":220,"ability_name":"決心","ability_explan":"行動開始時に前衛&SP15以上のとき自身のスキル攻撃力+30%","ability_short_explan":"SP15以上のときスキル攻撃力+30%","activation_timing":1,"activation_place":1,"conditions":"SP15以上","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":30,"effect_count":1},
    {"ability_id":221,"ability_name":"鋭気","ability_explan":"行動開始時に前衛&敵が挑発または注目状態のとき自身のスキル攻撃力+30%","ability_short_explan":"敵が挑発または注目状態のときスキル攻撃力+30%","activation_timing":1,"activation_place":1,"conditions":"敵が挑発/注目状態","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":30,"effect_count":1},
    {"ability_id":222,"ability_name":"弱化","ability_explan":"行動開始時に前衛にいると敵の防御力-10%","ability_short_explan":"敵の防御力-10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":0,"ability_element":0,"effect_type":2,"effect_size":10,"effect_count":1},
    {"ability_id":223,"ability_name":"火の制圧","ability_explan":"行動開始時に前衛&DP80%以上のとき敵の火属性の防御力-18%","ability_short_explan":"DP80%以上のとき敵の火属性の防御力-18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":5,"ability_physical":0,"ability_element":1,"effect_type":2,"effect_size":18,"effect_count":1},
    {"ability_id":224,"ability_name":"氷の制圧","ability_explan":"行動開始時に前衛&DP80%以上のとき敵の氷属性の防御力-18%","ability_short_explan":"DP80%以上のとき敵の氷属性の防御力-18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":5,"ability_physical":0,"ability_element":2,"effect_type":2,"effect_size":18,"effect_count":1},
    {"ability_id":225,"ability_name":"雷の制圧","ability_explan":"行動開始時に前衛&DP80%以上のとき敵の雷属性の防御力-18%","ability_short_explan":"DP80%以上のとき敵の雷属性の防御力-18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":5,"ability_physical":0,"ability_element":3,"effect_type":2,"effect_size":18,"effect_count":1},
    {"ability_id":226,"ability_name":"光の制圧","ability_explan":"行動開始時に前衛&DP80%以上のとき敵の光属性の防御力-18%","ability_short_explan":"DP80%以上のとき敵の光属性の防御力-18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":5,"ability_physical":0,"ability_element":4,"effect_type":2,"effect_size":18,"effect_count":1},
    {"ability_id":227,"ability_name":"闇の制圧","ability_explan":"行動開始時に前衛&DP80%以上のとき敵の闇属性の防御力-18%","ability_short_explan":"DP80%以上のとき闇の雷属性の防御力-18%","activation_timing":1,"activation_place":1,"conditions":"DP80%以上","ability_target":5,"ability_physical":0,"ability_element":5,"effect_type":2,"effect_size":18,"effect_count":1},
    {"ability_id":234,"ability_name":"光の応援","ability_explan":"行動開始時に後衛&DP80%以上のとき前衛の光属性のスキル攻撃力+18%","ability_short_explan":"DP80%以上のとき光属性のスキル攻撃力+18%","activation_timing":1,"activation_place":2,"conditions":"DP80%以上","ability_target":2,"ability_physical":0,"ability_element":4,"effect_type":1,"effect_size":18,"effect_count":1},
    {"ability_id":235,"ability_name":"鮮烈","ability_explan":"行動開始時に前衛にいると自身のスキル攻撃時の破壊率上昇量+30%","ability_short_explan":"自身のスキル攻撃時の破壊率上昇量+30%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":5,"effect_size":30,"effect_count":1},
    {"ability_id":236,"ability_name":"強烈","ability_explan":"行動開始時に前衛にいると前衛のスキル攻撃時の破壊率上昇量+20%","ability_short_explan":"前衛のスキル攻撃時の破壊率上昇量+20%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":0,"effect_type":5,"effect_size":20,"effect_count":1},
    {"ability_id":237,"ability_name":"心眼の境地","ability_explan":"行動開始時に前衛&自身が心眼状態のとき、自身のスキル攻撃力+15%","ability_short_explan":"自身が心眼状態のとき、自身のスキル攻撃力+15%","activation_timing":1,"activation_place":1,"conditions":"心眼状態","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":15,"effect_count":1},
    {"ability_id":238,"ability_name":"勇気","ability_explan":"行動開始時に前衛&DP50%以上のとき自身のスキル攻撃力+15%","ability_short_explan":"DP50%以上のときスキル攻撃力+15%","activation_timing":1,"activation_place":1,"conditions":"DP50％以上","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":15,"effect_count":1},
    {"ability_id":239,"ability_name":"決意","ability_explan":"行動開始時に前衛&SP10以上のとき自身のスキル攻撃力+15%","ability_short_explan":"SP10以上のときスキル攻撃力+15%","activation_timing":1,"activation_place":1,"conditions":"SP10以上","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":15,"effect_count":1},
    {"ability_id":240,"ability_name":"危険な火遊び","ability_explan":"行動開始時に前衛&DP破損状態で自身の火属性のスキル攻撃力+50%","ability_short_explan":"DP破損状態で火属性のスキル攻撃力+50%","activation_timing":1,"activation_place":1,"conditions":"DP破損状態","ability_target":2,"ability_physical":0,"ability_element":1,"effect_type":1,"effect_size":50,"effect_count":1},
    {"ability_id":241,"ability_name":"火の意志","ability_explan":"行動開始時に前衛にいると前衛の火属性のスキル攻撃力+12%","ability_short_explan":"火属性のスキル攻撃力+12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":1,"effect_type":1,"effect_size":12,"effect_count":1},
    {"ability_id":242,"ability_name":"氷の意志","ability_explan":"行動開始時に前衛にいると前衛の氷属性のスキル攻撃力+12%","ability_short_explan":"氷属性のスキル攻撃力+12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":2,"effect_type":1,"effect_size":12,"effect_count":1},
    {"ability_id":243,"ability_name":"雷の意志","ability_explan":"行動開始時に前衛にいると前衛の雷属性のスキル攻撃力+12%","ability_short_explan":"雷属性のスキル攻撃力+12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":3,"effect_type":1,"effect_size":12,"effect_count":1},
    {"ability_id":244,"ability_name":"闇の意志","ability_explan":"行動開始時に前衛にいると前衛の闇属性のスキル攻撃力+12%","ability_short_explan":"闇属性のスキル攻撃力+12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":5,"effect_type":1,"effect_size":12,"effect_count":1},
    {"ability_id":245,"ability_name":"光の意志","ability_explan":"行動開始時に前衛にいると前衛の光属性のスキル攻撃力+12%","ability_short_explan":"光属性のスキル攻撃力+12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":2,"effect_type":1,"effect_size":12,"effect_count":1},
    {"ability_id":246,"ability_name":"斬の意志","ability_explan":"行動開始時に前衛にいると前衛の斬属性のスキル攻撃力+10%","ability_short_explan":"斬属性のスキル攻撃力+10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":1,"ability_element":0,"effect_type":1,"effect_size":10,"effect_count":1},
    {"ability_id":247,"ability_name":"突の意志","ability_explan":"行動開始時に前衛にいると前衛の突属性のスキル攻撃力+10%","ability_short_explan":"突属性のスキル攻撃力+10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":2,"ability_element":0,"effect_type":1,"effect_size":10,"effect_count":1},
    {"ability_id":248,"ability_name":"打の意志","ability_explan":"行動開始時に前衛にいると前衛の打属性のスキル攻撃力+10%","ability_short_explan":"打属性のスキル攻撃力+10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":3,"ability_element":0,"effect_type":1,"effect_size":10,"effect_count":1},
    {"ability_id":251,"ability_name":"火の威圧","ability_explan":"行動開始時に前衛にいると敵の火属性の防御力-12%","ability_short_explan":"敵の火属性の防御力-12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":0,"ability_element":1,"effect_type":2,"effect_size":12,"effect_count":1},
    {"ability_id":252,"ability_name":"氷の威圧","ability_explan":"行動開始時に前衛にいると敵の氷属性の防御力-12%","ability_short_explan":"敵の氷属性の防御力-12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":0,"ability_element":2,"effect_type":2,"effect_size":12,"effect_count":1},
    {"ability_id":253,"ability_name":"雷の威圧","ability_explan":"行動開始時に前衛にいると敵の雷属性の防御力-12%","ability_short_explan":"敵の雷属性の防御力-12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":0,"ability_element":3,"effect_type":2,"effect_size":12,"effect_count":1},
    {"ability_id":254,"ability_name":"光の威圧","ability_explan":"行動開始時に前衛にいると敵の光属性の防御力-12%","ability_short_explan":"敵の光属性の防御力-12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":0,"ability_element":4,"effect_type":2,"effect_size":12,"effect_count":1},
    {"ability_id":255,"ability_name":"闇の威圧","ability_explan":"行動開始時に前衛にいると敵の闇属性の防御力-12%","ability_short_explan":"敵の闇属性の防御力-12%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":0,"ability_element":5,"effect_type":2,"effect_size":12,"effect_count":1},
    {"ability_id":256,"ability_name":"斬の威圧","ability_explan":"行動開始時に前衛にいると敵の斬属性の防御力-10%","ability_short_explan":"敵の斬属性の防御力-10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":1,"ability_element":0,"effect_type":2,"effect_size":10,"effect_count":1},
    {"ability_id":257,"ability_name":"突の威圧","ability_explan":"行動開始時に前衛にいると敵の突属性の防御力-10%","ability_short_explan":"敵の突属性の防御力-10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":2,"ability_element":0,"effect_type":2,"effect_size":10,"effect_count":1},
    {"ability_id":258,"ability_name":"打の威圧","ability_explan":"行動開始時に前衛にいると敵の打属性の防御力-10%","ability_short_explan":"敵の打属性の防御力-10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":3,"ability_element":0,"effect_type":2,"effect_size":10,"effect_count":1},
    {"ability_id":261,"ability_name":"火の躍動","ability_explan":"行動開始時前衛にいると前衛の火属性のクリティカルダメージ+10%","ability_short_explan":"火属性のクリティカルダメージ+10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":1,"effect_type":4,"effect_size":10,"effect_count":1},
    {"ability_id":262,"ability_name":"氷の躍動","ability_explan":"行動開始時前衛にいると前衛の氷属性のクリティカルダメージ+10%","ability_short_explan":"氷属性のクリティカルダメージ+10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":1,"effect_type":4,"effect_size":10,"effect_count":1},
    {"ability_id":264,"ability_name":"光の躍動","ability_explan":"行動開始時前衛にいると前衛の光属性のクリティカルダメージ+10%","ability_short_explan":"光属性のクリティカルダメージ+10%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":4,"effect_type":4,"effect_size":10,"effect_count":1},
    {"ability_id":266,"ability_name":"斬の躍動","ability_explan":"行動開始時前衛にいると前衛の斬属性のクリティカルダメージ+8%","ability_short_explan":"斬属性のクリティカルダメージ+8%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":1,"ability_element":0,"effect_type":4,"effect_size":8,"effect_count":1},
    {"ability_id":267,"ability_name":"突の躍動","ability_explan":"行動開始時前衛にいると前衛の突属性のクリティカルダメージ+8%","ability_short_explan":"突属性のクリティカルダメージ+8%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":2,"ability_element":0,"effect_type":4,"effect_size":8,"effect_count":1},
    {"ability_id":268,"ability_name":"打の躍動","ability_explan":"行動開始時前衛にいると前衛の打属性のクリティカルダメージ+8%","ability_short_explan":"打属性のクリティカルダメージ+8%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":3,"ability_element":0,"effect_type":4,"effect_size":8,"effect_count":1},
    {"ability_id":271,"ability_name":"火の慧眼","ability_explan":"行動開始時前衛にいると前衛の火属性のクリティカル率+20%","ability_short_explan":"火属性のクリティカル率+20%","activation_timing":1,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":1,"effect_type":3,"effect_size":20,"effect_count":1},
    {"ability_id":301,"ability_name":"専心","ability_explan":"オーバードライブ開始時前衛にいると自身のスキル攻撃力+20%","ability_short_explan":"オーバードライブ開始時前衛にいると自身のスキル攻撃力+20%","activation_timing":5,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":20,"effect_count":1},
    {"ability_id":401,"ability_name":"火の波動","ability_explan":"味方全体の火属性スキル攻撃力を常時+10%","ability_short_explan":"火属性スキル攻撃力を常時+10%","activation_timing":0,"activation_place":3,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":1,"effect_type":1,"effect_size":10,"effect_count":0},
    {"ability_id":402,"ability_name":"氷の波動","ability_explan":"味方全体の氷属性スキル攻撃力を常時+10%","ability_short_explan":"氷属性スキル攻撃力を常時+10%","activation_timing":0,"activation_place":3,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":2,"effect_type":1,"effect_size":10,"effect_count":0},
    {"ability_id":403,"ability_name":"雷の波動","ability_explan":"味方全体の雷属性スキル攻撃力を常時+10%","ability_short_explan":"雷属性スキル攻撃力を常時+10%","activation_timing":0,"activation_place":3,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":3,"effect_type":1,"effect_size":10,"effect_count":0},
    {"ability_id":404,"ability_name":"光の波動","ability_explan":"味方全体の光属性スキル攻撃力を常時+10%","ability_short_explan":"光属性スキル攻撃力を常時+10%","activation_timing":0,"activation_place":3,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":4,"effect_type":1,"effect_size":10,"effect_count":0},
    {"ability_id":405,"ability_name":"闇の波動","ability_explan":"味方全体の闇属性スキル攻撃力を常時+10%","ability_short_explan":"闇属性スキル攻撃力を常時+10%","activation_timing":0,"activation_place":3,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":5,"effect_type":1,"effect_size":10,"effect_count":0},
    {"ability_id":406,"ability_name":"万物の波動","ability_explan":"味方全体のスキル攻撃力を常時+8%","ability_short_explan":"スキル攻撃力を常時+8%","activation_timing":0,"activation_place":3,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":8,"effect_count":0},
    {"ability_id":407,"ability_name":"浄化の喝采","ability_explan":"自身が敵のバフを解除したとき全体にスキル攻撃力30%アップ(8ターン)を付与","ability_short_explan":"敵のバフを解除したときスキル攻撃力30%アップ(8ターン)","activation_timing":0,"activation_place":0,"conditions":"バフ解除時","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":30,"effect_count":8},
    {"ability_id":408,"ability_name":"破砕の喝采","ability_explan":"自身の攻撃で敵をブレイクしたとき全体にスキル攻撃力30%アップ(8ターン)を付与","ability_short_explan":"敵をブレイクしたときスキル攻撃力30%アップ(8ターン)","activation_timing":0,"activation_place":0,"conditions":"ブレイク時","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":30,"effect_count":8},
    {"ability_id":501,"ability_name":"気転","ability_explan":"自身がかけたスキル攻撃力アップの効果量+25%","ability_short_explan":"自身がかけたスキル攻撃力アップの効果量+25%","activation_timing":1,"activation_place":0,"conditions":"","ability_target":0,"ability_physical":0,"ability_element":0,"effect_type":0,"effect_size":25,"effect_count":null},
    {"ability_id":502,"ability_name":"侵食","ability_explan":"自身がかけた防御力ダウンの効果量+25%","ability_short_explan":"自身がかけた防御力ダウンの効果量+25%","activation_timing":1,"activation_place":0,"conditions":"","ability_target":0,"ability_physical":0,"ability_element":0,"effect_type":0,"effect_size":25,"effect_count":null},
    {"ability_id":601,"ability_name":"サイキックハイ","ability_explan":"戦闘中【ヒットチャートからの一閃】を1回以上使用しているとき自身のスキル攻撃力+50%","ability_short_explan":"【ヒットチャートからの一閃】使用後、自身のスキル攻撃力+50%","activation_timing":1,"activation_place":1,"conditions":"固有技使用","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":1,"effect_size":50,"effect_count":1},
    {"ability_id":1001,"ability_name":"威嚇の叫び","ability_explan":"バトル開始時前衛にいると高確率で敵をスタン","ability_short_explan":"","activation_timing":0,"activation_place":1,"conditions":"確率50%","ability_target":5,"ability_physical":0,"ability_element":0,"effect_type":21,"effect_size":null,"effect_count":1},
    {"ability_id":1002,"ability_name":"洗練","ability_explan":"バトル開始時前衛にいると自身のトークン+5","ability_short_explan":"","activation_timing":0,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":15,"effect_size":5,"effect_count":null},
    {"ability_id":1003,"ability_name":"厄災","ability_explan":"バトル開始時前衛にいると敵を厄状態(2ターン)","ability_short_explan":"","activation_timing":0,"activation_place":1,"conditions":"","ability_target":5,"ability_physical":0,"ability_element":0,"effect_type":22,"effect_size":null,"effect_count":2},
    {"ability_id":1004,"ability_name":"俊敏","ability_explan":"バトル開始時前衛にいると自身のSP+5","ability_short_explan":"","activation_timing":0,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":5,"effect_count":null},
    {"ability_id":1005,"ability_name":"根性","ability_explan":"バトル開始時自身にブレイクガード(1回)を付与する","ability_short_explan":"","activation_timing":0,"activation_place":3,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":20,"effect_size":null,"effect_count":0},
    {"ability_id":1006,"ability_name":"咆吼","ability_explan":"バトル開始時前衛にいるとオーバードライブゲージ+10%","ability_short_explan":"","activation_timing":0,"activation_place":1,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":14,"effect_size":10,"effect_count":null},
    {"ability_id":1007,"ability_name":"機敏","ability_explan":"バトル開始時前衛にいると自身のSP+2","ability_short_explan":"","activation_timing":0,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":12,"effect_size":2,"effect_count":null},
    {"ability_id":1008,"ability_name":"警衛","ability_explan":"バトル開始時前衛にいると自身の防御力+25%(3ターン)","ability_short_explan":"","activation_timing":0,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":25,"effect_count":3},
    {"ability_id":1011,"ability_name":"火炎の護り","ability_explan":"バトル開始時火属性スタイルが3体以上のとき味方全員の防御力+50%(4ターン/重複不可)","ability_short_explan":"","activation_timing":0,"activation_place":3,"conditions":"火属性スタイルが4体以上","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":50,"effect_count":4},
    {"ability_id":1101,"ability_name":"閃光","ability_explan":"ターン開始時に前衛にいると自身のSP+1","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":1,"effect_count":null},
    {"ability_id":1102,"ability_name":"くじけぬ心","ability_explan":"ターン開始時前衛&ブレイク状態のとき自身のDPを復活(1回)","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"DP破損状態","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":13,"effect_size":50,"effect_count":null},
    {"ability_id":1103,"ability_name":"向上心","ability_explan":"ターン開始時前衛にいるとオーバードライブゲージ+5%","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":14,"effect_size":5,"effect_count":null},
    {"ability_id":1104,"ability_name":"賢守","ability_explan":"ターン開始時前衛にいると自身の防御力+30%","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":30,"effect_count":1},
    {"ability_id":1105,"ability_name":"博愛の心","ability_explan":"ターン開始時前衛にいると前衛のDP+10%","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"","ability_target":2,"ability_physical":0,"ability_element":0,"effect_type":13,"effect_size":10,"effect_count":null},
    {"ability_id":1106,"ability_name":"慈愛の心","ability_explan":"ターン開始時前衛にいると味方全体のDP+7%","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":13,"effect_size":7,"effect_count":null},
    {"ability_id":1107,"ability_name":"後閃","ability_explan":"ターン開始時に後衛にいると自身のSP+1","ability_short_explan":"","activation_timing":2,"activation_place":2,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":1,"effect_count":null},
    {"ability_id":1108,"ability_name":"後方救護","ability_explan":"ターン開始時後衛にいると味方全体のDP+7%","ability_short_explan":"","activation_timing":2,"activation_place":2,"conditions":"","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":13,"effect_size":7,"effect_count":null},
    {"ability_id":1109,"ability_name":"吉報","ability_explan":"ターン開始時前衛にいると確率で自身のSP+3","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"確率30%","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":12,"effect_size":3,"effect_count":null},
    {"ability_id":1110,"ability_name":"羽休め","ability_explan":"ターン開始時自身のDP+7%(150%まで上限突破可)","ability_short_explan":"","activation_timing":2,"activation_place":3,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":13,"effect_size":7,"effect_count":null},
    {"ability_id":1111,"ability_name":"みなぎる士気","ability_explan":"ターン開始時に前衛＆士気Lvが6以上のとき自身のSP+1","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"士気Lv6以上","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":12,"effect_size":1,"effect_count":null},
    {"ability_id":1112,"ability_name":"好機","ability_explan":"ターン開始時に前衛&SPが3以下のとき自身のSP+1","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"SP3以下","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":12,"effect_size":1,"effect_count":null},
    {"ability_id":1113,"ability_name":"気合","ability_explan":"ターン開始時前衛にいるとDP50%以下のとき自身のDP+15%","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"DP50%以下","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":13,"effect_size":15,"effect_count":null},
    {"ability_id":1114,"ability_name":"福運","ability_explan":"ターン開始時前衛にいると確率でオーバードライブゲージ+10%","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"確率30%","ability_target":4,"ability_physical":0,"ability_element":0,"effect_type":14,"effect_size":10,"effect_count":null},
    {"ability_id":1115,"ability_name":"友愛","ability_explan":"ターン開始時前衛にいると後衛のDP+10%","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"","ability_target":3,"ability_physical":0,"ability_element":0,"effect_type":13,"effect_size":10,"effect_count":null},
    {"ability_id":1116,"ability_name":"先駆","ability_explan":"ターン開始時前衛にいると後衛のSP+1","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"","ability_target":0,"ability_physical":0,"ability_element":0,"effect_type":12,"effect_size":1,"effect_count":null},
    {"ability_id":1203,"ability_name":"防御態勢","ability_explan":"行動開始時に前衛&DP100%以上のとき自身の防御力+50%","ability_short_explan":"","activation_timing":2,"activation_place":1,"conditions":"DP100%以上","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":50,"effect_count":1},
    {"ability_id":1501,"ability_name":"恵風","ability_explan":"自身がかけた回復スキルの効果量+20%","ability_short_explan":"","activation_timing":2,"activation_place":0,"conditions":"","ability_target":0,"ability_physical":0,"ability_element":0,"effect_type":0,"effect_size":20,"effect_count":null},
    {"ability_id":1502,"ability_name":"堅忍","ability_explan":"敵行動開始時に前衛&DP破損状態で自身の防御力+50%","ability_short_explan":"","activation_timing":3,"activation_place":1,"conditions":"DP0%","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":50,"effect_count":1},
    {"ability_id":1503,"ability_name":"戦勲","ability_explan":"ダメージを与えた敵1体につきトークンを1上昇(追撃を除く)","ability_short_explan":"","activation_timing":0,"activation_place":0,"conditions":"ダメージを与えたとき","ability_target":0,"ability_physical":0,"ability_element":0,"effect_type":15,"effect_size":1,"effect_count":null},
    {"ability_id":1504,"ability_name":"戦士の祝福","ability_explan":"スキルでDP回復効果を受けるとトークンを1上昇","ability_short_explan":"","activation_timing":0,"activation_place":0,"conditions":"DP回復効果を受けたとき","ability_target":0,"ability_physical":0,"ability_element":0,"effect_type":15,"effect_size":1,"effect_count":null},
    {"ability_id":1505,"ability_name":"激動","ability_explan":"自身の攻撃で敵をブレイクしたとき初回のみ自身のSPが8上昇する","ability_short_explan":"","activation_timing":0,"activation_place":0,"conditions":"ブレイク時","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":8,"effect_count":null},
    {"ability_id":1506,"ability_name":"クイックリキャスト","ability_explan":"追加ターン中のとき自身の消費SP-2","ability_short_explan":"","activation_timing":4,"activation_place":3,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":15,"effect_size":2,"effect_count":null},
    {"ability_id":1507,"ability_name":"忍耐","ability_explan":"敵行動開始時に前衛&DP50%以下のとき自身の防御力+25%","ability_short_explan":"","activation_timing":3,"activation_place":1,"conditions":"DP50%以下","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":11,"effect_size":25,"effect_count":1},
    {"ability_id":1508,"ability_name":"鉄壁","ability_explan":"敵行動開始時前衛にいるとトークン1つにつき防御力+7%","ability_short_explan":"","activation_timing":3,"activation_place":1,"conditions":"","ability_target":1,"ability_physical":0,"ability_element":0,"effect_type":32,"effect_size":7,"effect_count":1},
];