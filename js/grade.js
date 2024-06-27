﻿let grade_list = [
    {"score_attack_no":0,"half":0,"grade_no":0,"start_date":"0001-01-01T00:00:00","end_date":"0001-01-01T00:00:00","grade_name":"無し","grade_rate":0,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":40,"half":1,"grade_no":1,"start_date":"2023-12-15T11:00:00","end_date":"2023-12-22T11:00:00","grade_name":"無属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":40,"half":1,"grade_no":2,"start_date":"2023-12-15T11:00:00","end_date":"2023-12-22T11:00:00","grade_name":"防御力超特大アップ闇弱点に変化","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":30,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":50,"element_4":0,"element_5":-150,"destruction":0,"critical":0},
    {"score_attack_no":40,"half":1,"grade_no":3,"start_date":"2023-12-15T11:00:00","end_date":"2023-12-22T11:00:00","grade_name":"回復行動増加","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":40,"half":2,"grade_no":1,"start_date":"2023-12-22T11:00:00","end_date":"2023-12-29T11:00:00","grade_name":"敵の氷と光属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":80,"element_3":0,"element_4":80,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":40,"half":2,"grade_no":2,"start_date":"2023-12-22T11:00:00","end_date":"2023-12-29T11:00:00","grade_name":"5ターン毎に敵の攻撃力アップ","grade_rate":10,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":40,"half":2,"grade_no":3,"start_date":"2023-12-22T11:00:00","end_date":"2023-12-29T11:00:00","grade_name":"味方の最大DPが割合30%低下","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":41,"half":1,"grade_no":1,"start_date":"2023-12-29T11:00:00","end_date":"2024-01-05T11:00:00","grade_name":"敵の斬属性耐性50％アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":50,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":41,"half":1,"grade_no":2,"start_date":"2023-12-29T11:00:00","end_date":"2024-01-05T11:00:00","grade_name":"敵の攻防大アップ、火耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":15,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":-150,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":41,"half":1,"grade_no":3,"start_date":"2023-12-29T11:00:00","end_date":"2024-01-05T11:00:00","grade_name":"敵のHP+75%","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":75,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":41,"half":2,"grade_no":1,"start_date":"2024-01-05T11:00:00","end_date":"2024-01-12T11:00:00","grade_name":"敵の無属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":41,"half":2,"grade_no":2,"start_date":"2024-01-05T11:00:00","end_date":"2024-01-12T11:00:00","grade_name":"敵の攻防大アップ、光耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":15,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":-150,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":41,"half":2,"grade_no":3,"start_date":"2024-01-05T11:00:00","end_date":"2024-01-12T11:00:00","grade_name":"敵のHP+75%","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":75,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":42,"half":1,"grade_no":1,"start_date":"2024-01-12T11:00:00","end_date":"2024-01-20T20:00:00","grade_name":"5ターン毎にODゲージ減少","grade_rate":10,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":42,"half":1,"grade_no":2,"start_date":"2024-01-12T11:00:00","end_date":"2024-01-20T20:00:00","grade_name":"5ターン毎に味方の防御力ダウン","grade_rate":10,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":42,"half":1,"grade_no":3,"start_date":"2024-01-12T11:00:00","end_date":"2024-01-20T20:00:00","grade_name":"敵のHP+75%","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":75,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":42,"half":2,"grade_no":1,"start_date":"2024-01-20T20:00:00","end_date":"2024-01-26T11:00:00","grade_name":"敵の無属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":42,"half":2,"grade_no":2,"start_date":"2024-01-20T20:00:00","end_date":"2024-01-26T11:00:00","grade_name":"5ターン毎に隊列入れ替え不可","grade_rate":10,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":42,"half":2,"grade_no":3,"start_date":"2024-01-20T20:00:00","end_date":"2024-01-26T11:00:00","grade_name":"味方の最大DPが割合30%低下","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":43,"half":1,"grade_no":1,"start_date":"2024-01-26T11:00:00","end_date":"2024-01-31T11:00:00","grade_name":"敵のDP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":50,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":43,"half":1,"grade_no":2,"start_date":"2024-01-26T11:00:00","end_date":"2024-01-31T11:00:00","grade_name":"ODがLv.2以上でしか発動できない","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":43,"half":1,"grade_no":3,"start_date":"2024-01-26T11:00:00","end_date":"2024-01-31T11:00:00","grade_name":"味方のクリティカル率が50%ダウン","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":50},
    {"score_attack_no":43,"half":2,"grade_no":1,"start_date":"2024-01-31T11:00:00","end_date":"2024-02-04T20:00:00","grade_name":"敵の破壊率耐性40%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":40,"critical":0},
    {"score_attack_no":43,"half":2,"grade_no":2,"start_date":"2024-01-31T11:00:00","end_date":"2024-02-04T20:00:00","grade_name":"5ターン毎に敵の攻撃力アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":43,"half":2,"grade_no":3,"start_date":"2024-01-31T11:00:00","end_date":"2024-02-04T20:00:00","grade_name":"敵のHP+75%","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":75,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":44,"half":1,"grade_no":1,"start_date":"2024-02-04T20:00:00","end_date":"2024-02-11T11:00:00","grade_name":"敵のHP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":50,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":44,"half":1,"grade_no":2,"start_date":"2024-02-04T20:00:00","end_date":"2024-02-11T11:00:00","grade_name":"敵のDP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":50,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":44,"half":1,"grade_no":3,"start_date":"2024-02-04T20:00:00","end_date":"2024-02-11T11:00:00","grade_name":"Healerのスキル使用回数2回","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":44,"half":2,"grade_no":1,"start_date":"2024-02-11T11:00:00","end_date":"2024-02-16T11:00:00","grade_name":"敵の打属性耐性50%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":50,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":44,"half":2,"grade_no":2,"start_date":"2024-02-11T11:00:00","end_date":"2024-02-16T11:00:00","grade_name":"味方の最大DPが割合15%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":44,"half":2,"grade_no":3,"start_date":"2024-02-11T11:00:00","end_date":"2024-02-16T11:00:00","grade_name":"敵の攻撃力と防御力がアップ","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":10,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":1,"grade_no":1,"start_date":"2024-02-16T11:00:00","end_date":"2024-02-23T11:00:00","grade_name":"敵の火と光属性耐性80%アップ、斬耐性80%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":-80,"physical_2":0,"physical_3":0,"element_0":0,"element_1":80,"element_2":0,"element_3":0,"element_4":80,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":1,"grade_no":2,"start_date":"2024-02-16T11:00:00","end_date":"2024-02-23T11:00:00","grade_name":"味方の最大DPが割合15%ダウン","grade_rate":10,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":1,"grade_no":3,"start_date":"2024-02-16T11:00:00","end_date":"2024-02-23T11:00:00","grade_name":"敵の行動パターンが変化し、全体攻撃のたびに攻撃力超特大アップ","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":2,"grade_no":1,"start_date":"2024-02-23T11:00:00","end_date":"2024-03-01T11:00:00","grade_name":"敵の無属性耐性80%アップ、闇属性耐性150％ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":-150,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":2,"grade_no":2,"start_date":"2024-02-23T11:00:00","end_date":"2024-03-01T11:00:00","grade_name":"敵のHP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":50,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":2,"grade_no":3,"start_date":"2024-02-23T11:00:00","end_date":"2024-03-01T11:00:00","grade_name":"敵の行動パターンが変化し、全体攻撃のたびに攻撃力超特大アップ","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":3,"grade_no":1,"start_date":"2024-03-01T11:00:00","end_date":"2024-03-08T11:00:00","grade_name":"敵の無属性耐性80%アップ、火属性耐性150％ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":-150,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":3,"grade_no":2,"start_date":"2024-03-01T11:00:00","end_date":"2024-03-08T11:00:00","grade_name":"敵のDP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":50,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":45,"half":3,"grade_no":3,"start_date":"2024-03-01T11:00:00","end_date":"2024-03-08T11:00:00","grade_name":"敵の行動パターンが変化し、単体攻撃に防御力超特大ダウンを追加","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":46,"half":1,"grade_no":1,"start_date":"2024-03-08T11:00:00","end_date":"2024-03-15T11:00:00","grade_name":"敵の斬属性耐性50%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":50,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":46,"half":1,"grade_no":2,"start_date":"2024-03-08T11:00:00","end_date":"2024-03-15T11:00:00","grade_name":"敵のDP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":50,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":46,"half":1,"grade_no":3,"start_date":"2024-03-08T11:00:00","end_date":"2024-03-15T11:00:00","grade_name":"Healerのスキル使用回数2回","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":46,"half":2,"grade_no":1,"start_date":"2024-03-15T11:00:00","end_date":"2024-03-22T11:00:00","grade_name":"敵の打属性耐性50%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":50,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":46,"half":2,"grade_no":2,"start_date":"2024-03-15T11:00:00","end_date":"2024-03-22T11:00:00","grade_name":"3ターン毎に味方のDP回復量5%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":46,"half":2,"grade_no":3,"start_date":"2024-03-15T11:00:00","end_date":"2024-03-22T11:00:00","grade_name":"毎ターンODゲージ減少","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":47,"half":1,"grade_no":1,"start_date":"2024-03-22T11:00:00","end_date":"2024-03-29T11:00:00","grade_name":"味方のDP回復量40%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":47,"half":1,"grade_no":2,"start_date":"2024-03-22T11:00:00","end_date":"2024-03-29T11:00:00","grade_name":"敵のHP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":50,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":47,"half":1,"grade_no":3,"start_date":"2024-03-22T11:00:00","end_date":"2024-03-29T11:00:00","grade_name":"Attackerのスキル使用回数2回","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":47,"half":2,"grade_no":1,"start_date":"2024-03-29T11:00:00","end_date":"2024-04-05T11:00:00","grade_name":"味方のDP割合15%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":47,"half":2,"grade_no":2,"start_date":"2024-03-29T11:00:00","end_date":"2024-04-05T11:00:00","grade_name":"敵のDP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":50,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":47,"half":2,"grade_no":3,"start_date":"2024-03-29T11:00:00","end_date":"2024-04-05T11:00:00","grade_name":"Breakerのスキル使用回数2回","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":1,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の打属性耐性80%アップ、光と闇耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":80,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":-150,"element_5":-150,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":1,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"ODがLv.2以上でしか発動できない","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":1,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"Defenderのスキル使用回数2回","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":2,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の斬属性耐性80%アップ、火と闇耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":80,"physical_2":0,"physical_3":0,"element_0":0,"element_1":-150,"element_2":0,"element_3":0,"element_4":0,"element_5":-150,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":2,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のHP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":50,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":2,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"味方のDP回復量50%ダウン","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":3,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の突属性耐性80%アップ、氷と雷耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":80,"physical_3":0,"element_0":0,"element_1":0,"element_2":-150,"element_3":-150,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":3,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"味方の最大DPが割合15%低下","grade_rate":10,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":48,"half":3,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"Blasterのスキル使用回数2回","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":49,"half":1,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のDP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":50,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":49,"half":1,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"ODがLv.2以上でしか発動できない","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":49,"half":1,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の防御力が特大アップ","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":20,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":49,"half":2,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の斬属性耐性80%アップ、火と光耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":80,"physical_2":0,"physical_3":0,"element_0":0,"element_1":-150,"element_2":0,"element_3":0,"element_4":-150,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":49,"half":2,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のHP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":50,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":49,"half":2,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"味方のDP回復量50%ダウン","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":50,"half":1,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"無属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":50,"half":1,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のHP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":50,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":50,"half":1,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"味方のクリティカル率が50%ダウン","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":50},
    {"score_attack_no":50,"half":2,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"Attackerのスキル使用回数2回","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":50,"half":2,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の破壊率耐性40%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":40,"critical":0},
    {"score_attack_no":50,"half":2,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の攻撃力と防御力がアップ(解除不可)","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":10,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":51,"half":1,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のDP+25%","grade_rate":5,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":25,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":51,"half":1,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の攻撃力がアップ(解除不可)","grade_rate":5,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":51,"half":1,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"ODがLv.2以上でしか発動できない","grade_rate":10,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":51,"half":1,"grade_no":4,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のHP+75%","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":75,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":52,"half":1,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"5ターン毎にSPが3減少","grade_rate":10,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":52,"half":1,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"味方の最大DPが割合15%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":52,"half":1,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"Defenderのスキル使用回数2回","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":52,"half":2,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のDP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":50,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":52,"half":2,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"ODがLv.2以上でしか発動できない","grade_rate":10,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":52,"half":2,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"毎ターンODゲージ減少","grade_rate":15,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":53,"half":1,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の攻撃力アップ(解除不可)、雷弱点が火弱点に変化","grade_rate":5,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":-150,"element_2":0,"element_3":150,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":53,"half":1,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のDP+25%","grade_rate":5,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":25,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":53,"half":1,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"5ターン毎に隊列入れ替え不可","grade_rate":10,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":53,"half":1,"grade_no":4,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"味方のDP回復量50%ダウン","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":53,"half":2,"grade_no":1,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵のHP+50%","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":50,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":53,"half":2,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"5ターン毎にSPが3減少","grade_rate":10,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":53,"half":2,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の行動パターンが変化し、デバフの使用頻度がアップ","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":54,"half":1,"grade_no":2,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"敵の突属性耐性80%アップ、氷耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":80,"physical_3":0,"element_0":0,"element_1":0,"element_2":-150,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":54,"half":1,"grade_no":3,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"ODがLv.2以上でしか発動できない","grade_rate":10,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
    {"score_attack_no":54,"half":1,"grade_no":4,"start_date":"2024-04-08T11:00:00","end_date":"2024-04-08T11:00:00","grade_name":"毎ターンODゲージ減少","grade_rate":15,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0,"critical":0},
];