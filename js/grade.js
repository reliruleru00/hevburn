﻿let grade_list = [
    {"score_attack_no":0,"half":0,"grade_no":0,"start_date":"0001-01-01T00:00:00 BC","end_date":"0001-01-01T00:00:00 BC","grade_name":"無し","grade_rate":0,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":40,"half":1,"grade_no":1,"start_date":"2023-12-15T11:00:00","end_date":"2023-12-22T11:00:00","grade_name":"無属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":40,"half":1,"grade_no":2,"start_date":"2023-12-15T11:00:00","end_date":"2023-12-22T11:00:00","grade_name":"防御力超特大アップ闇弱点に変化","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":30,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":50,"element_4":0,"element_5":-150,"destruction":0},
    {"score_attack_no":40,"half":1,"grade_no":3,"start_date":"2023-12-15T11:00:00","end_date":"2023-12-22T11:00:00","grade_name":"回復行動増加","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":40,"half":2,"grade_no":1,"start_date":"2023-12-22T11:00:00","end_date":"2023-12-29T11:00:00","grade_name":"敵の氷と光属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":80,"element_3":0,"element_4":80,"element_5":0,"destruction":0},
    {"score_attack_no":40,"half":2,"grade_no":2,"start_date":"2023-12-22T11:00:00","end_date":"2023-12-29T11:00:00","grade_name":"5ターン毎に敵の攻撃力アップ","grade_rate":10,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":40,"half":2,"grade_no":3,"start_date":"2023-12-22T11:00:00","end_date":"2023-12-29T11:00:00","grade_name":"味方の最大DPが割合30%低下","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":41,"half":1,"grade_no":1,"start_date":"2023-12-29T11:00:00","end_date":"2024-01-05T11:00:00","grade_name":"敵の斬属性耐性50％アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":50,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":41,"half":1,"grade_no":2,"start_date":"2023-12-29T11:00:00","end_date":"2024-01-05T11:00:00","grade_name":"敵の攻防大アップ、火耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":15,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":-150,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":41,"half":1,"grade_no":3,"start_date":"2023-12-29T11:00:00","end_date":"2024-01-05T11:00:00","grade_name":"敵のHP+75%","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":75,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":41,"half":2,"grade_no":1,"start_date":"2024-01-05T11:00:00","end_date":"2024-01-12T11:00:00","grade_name":"無属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":41,"half":2,"grade_no":2,"start_date":"2024-01-05T11:00:00","end_date":"2024-01-12T11:00:00","grade_name":"敵の攻防大アップ、光耐性150%ダウン","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":15,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":-150,"element_5":0,"destruction":0},
    {"score_attack_no":41,"half":2,"grade_no":3,"start_date":"2024-01-05T11:00:00","end_date":"2024-01-12T11:00:00","grade_name":"敵のHP+75%","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":75,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":42,"half":1,"grade_no":1,"start_date":"2024-01-12T11:00:00","end_date":"2024-01-19T11:00:00","grade_name":"5ターン毎にオーバードライブゲージ減少","grade_rate":10,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":42,"half":1,"grade_no":2,"start_date":"2024-01-12T11:00:00","end_date":"2024-01-19T11:00:00","grade_name":"5ターン毎に防御力ダウン","grade_rate":10,"grade_none":1,"step_turn":5,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":42,"half":1,"grade_no":3,"start_date":"2024-01-12T11:00:00","end_date":"2024-01-19T11:00:00","grade_name":"敵のHP+75%","grade_rate":15,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":75,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":42,"half":2,"grade_no":1,"start_date":"2024-01-19T11:00:00","end_date":"2024-01-26T11:00:00","grade_name":"無属性耐性80%アップ","grade_rate":10,"grade_none":0,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":80,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":42,"half":2,"grade_no":2,"start_date":"2024-01-19T11:00:00","end_date":"2024-01-26T11:00:00","grade_name":"5ターン毎に隊列入れ替え不可","grade_rate":10,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
    {"score_attack_no":42,"half":2,"grade_no":3,"start_date":"2024-01-19T11:00:00","end_date":"2024-01-26T11:00:00","grade_name":"DP割合30%低下","grade_rate":15,"grade_none":1,"step_turn":0,"defense_rate":0,"dp_rate":0,"hp_rate":0,"physical_1":0,"physical_2":0,"physical_3":0,"element_0":0,"element_1":0,"element_2":0,"element_3":0,"element_4":0,"element_5":0,"destruction":0},
];