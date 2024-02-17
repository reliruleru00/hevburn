﻿let enemy_list = [
    {"enemy_class":1,"enemy_class_no":1,"enemy_name":"デススラッグ（第1形態）","enemy_stat":290,"max_dp":"66000","max_hp":300000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":2,"enemy_name":"デススラッグ（第2形態）","enemy_stat":290,"max_dp":"88000","max_hp":1680000,"destruction":8,"destruction_limit":999,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":3,"enemy_name":"ロータリーモール(第1形態）","enemy_stat":310,"max_dp":"97600","max_hp":999999,"destruction":3,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":150,"physical_3":50,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":4,"enemy_name":"ロータリーモール(第2形態）","enemy_stat":310,"max_dp":"195000","max_hp":1842800,"destruction":6,"destruction_limit":999,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":150,"physical_3":50,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":5,"enemy_name":"レッドクリムゾン","enemy_stat":270,"max_dp":"225000","max_hp":5002200,"destruction":8,"destruction_limit":999,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":6,"enemy_name":"フィーラー","enemy_stat":290,"max_dp":"450000","max_hp":10200000,"destruction":8,"destruction_limit":999,"element_1":150,"element_2":150,"element_3":150,"element_4":150,"element_5":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":7,"enemy_name":"フラットハンド(3章/第1形態)","enemy_stat":320,"max_dp":"275000","max_hp":1875000,"destruction":6,"destruction_limit":300,"element_1":150,"element_2":150,"element_3":150,"element_4":150,"element_5":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":8,"enemy_name":"フラットハンド(3章/第2形態）","enemy_stat":320,"max_dp":"350000","max_hp":8625000,"destruction":10,"destruction_limit":999,"element_1":100,"element_2":100,"element_3":100,"element_4":150,"element_5":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":9,"enemy_name":"アルティメットフィーラー","enemy_stat":320,"max_dp":"500000","max_hp":15000000,"destruction":10,"destruction_limit":999,"element_1":150,"element_2":150,"element_3":150,"element_4":150,"element_5":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":10,"enemy_name":"フラットハンド(4章前半)","enemy_stat":380,"max_dp":"1000000","max_hp":38000000,"destruction":10,"destruction_limit":999,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":1,"enemy_class_no":11,"enemy_name":"デザートデンドロン","enemy_stat":380,"max_dp":"4452000","max_hp":183274000,"destruction":10,"destruction_limit":999,"element_1":100,"element_2":250,"element_3":100,"element_4":100,"element_5":250,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":1,"enemy_name":"エグゾウォッチャーR : Lv.3","enemy_stat":320,"max_dp":"65000","max_hp":300000,"destruction":4,"destruction_limit":300,"element_1":25,"element_2":200,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":2,"enemy_name":"エグゾウォッチャーB : Lv.3","enemy_stat":320,"max_dp":"65000","max_hp":300000,"destruction":4,"destruction_limit":300,"element_1":100,"element_2":25,"element_3":200,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":3,"enemy_name":"エグゾウォッチャーY : Lv.3","enemy_stat":320,"max_dp":"65000","max_hp":300000,"destruction":4,"destruction_limit":300,"element_1":200,"element_2":100,"element_3":25,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":4,"enemy_name":"エグゾウォッチャーW : Lv.3","enemy_stat":320,"max_dp":"65000","max_hp":300000,"destruction":4,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":25,"element_5":200,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":5,"enemy_name":"エグゾウォッチャーP : Lv.3","enemy_stat":320,"max_dp":"65000","max_hp":300000,"destruction":4,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":200,"element_5":25,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":6,"enemy_name":"レクタス/シニスター・ニールR : Lv.3","enemy_stat":340,"max_dp":"150000","max_hp":700000,"destruction":4,"destruction_limit":300,"element_1":25,"element_2":250,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":7,"enemy_name":"レクタス/シニスター・ニールB : Lv.3","enemy_stat":340,"max_dp":"150000","max_hp":700000,"destruction":4,"destruction_limit":300,"element_1":100,"element_2":25,"element_3":250,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":8,"enemy_name":"レクタス/シニスター・ニールY : Lv.3","enemy_stat":340,"max_dp":"150000","max_hp":700000,"destruction":4,"destruction_limit":300,"element_1":250,"element_2":100,"element_3":25,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":9,"enemy_name":"レクタス/シニスター・ニールW : Lv.3","enemy_stat":340,"max_dp":"150000","max_hp":700000,"destruction":4,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":25,"element_5":250,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":10,"enemy_name":"レクタス/シニスター・ニールP : Lv.3","enemy_stat":340,"max_dp":"150000","max_hp":700000,"destruction":4,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":250,"element_5":25,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":12,"enemy_name":"アモンB : Lv.3","enemy_stat":390,"max_dp":"1328600,1328600,1328600","max_hp":885733,"destruction":4,"destruction_limit":300,"element_1":100,"element_2":10,"element_3":350,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":2,"enemy_class_no":13,"enemy_name":"アモンY : Lv.3","enemy_stat":390,"max_dp":"1328600,1328600,1328600","max_hp":885733,"destruction":4,"destruction_limit":300,"element_1":350,"element_2":100,"element_3":10,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":1,"enemy_name":"(1F)モルアームズα","enemy_stat":340,"max_dp":"30000","max_hp":45500,"destruction":2,"destruction_limit":150,"element_1":200,"element_2":200,"element_3":200,"element_4":200,"element_5":200,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":2,"enemy_name":"(2F)サミットゴーレム","enemy_stat":340,"max_dp":"20000","max_hp":42000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":100,"physical_3":150,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":3,"enemy_name":"(2F)トライクロー","enemy_stat":340,"max_dp":"8320","max_hp":16000,"destruction":5,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":4,"enemy_name":"(2F)カースドール","enemy_stat":340,"max_dp":"13600","max_hp":19200,"destruction":5,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":250,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":5,"enemy_name":"(3F)バレルウォーカー","enemy_stat":340,"max_dp":"46000","max_hp":70000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":150,"physical_2":25,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":6,"enemy_name":"(4F)シャドウ・ユキ[Spitfire]","enemy_stat":340,"max_dp":"110000","max_hp":66000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":7,"enemy_name":"(5F)デススラッグ(第1形態)","enemy_stat":340,"max_dp":"20000","max_hp":60000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":8,"enemy_name":"(5F)デススラッグ(第2形態)","enemy_stat":340,"max_dp":"42000","max_hp":600000,"destruction":8,"destruction_limit":999,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":9,"enemy_name":"(6F)シュリンプクラブ","enemy_stat":340,"max_dp":"41000","max_hp":30000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":10,"enemy_name":"(7F)シャドウ・緋雨[バレット]","enemy_stat":340,"max_dp":"150000","max_hp":100000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":11,"enemy_name":"(8F)アビスノッカー","enemy_stat":340,"max_dp":"50000","max_hp":155000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":150,"physical_2":50,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":12,"enemy_name":"(9F)シャドウ・二以奈[BrandNew]","enemy_stat":340,"max_dp":"30000","max_hp":1350000,"destruction":6,"destruction_limit":999,"element_1":200,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":13,"enemy_name":"(10F)ワイヤーパープルγ","enemy_stat":350,"max_dp":"45000","max_hp":65000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":200,"element_5":100,"physical_1":150,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":14,"enemy_name":"(11F)シャドウ・菅原[ロリータ白書]","enemy_stat":350,"max_dp":"80000","max_hp":100000,"destruction":6,"destruction_limit":400,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":25,"physical_3":150,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":15,"enemy_name":"(12F)アラクネブルーライン","enemy_stat":350,"max_dp":"100000","max_hp":150000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":250,"element_4":100,"element_5":100,"physical_1":100,"physical_2":250,"physical_3":50,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":16,"enemy_name":"(13F)シャドウ・三郷[終局]","enemy_stat":350,"max_dp":"40000","max_hp":300000,"destruction":6,"destruction_limit":400,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":250,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":17,"enemy_name":"(14F)シェルプロテクシオン","enemy_stat":350,"max_dp":"75000","max_hp":95000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":25,"element_5":150,"physical_1":50,"physical_2":100,"physical_3":150,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":18,"enemy_name":"(15F)ファイアノッカー","enemy_stat":350,"max_dp":"46000","max_hp":298000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":200,"element_3":100,"element_4":100,"element_5":100,"physical_1":150,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":19,"enemy_name":"(16F)シャドウ・めぐみ[Ikki Burst]","enemy_stat":350,"max_dp":"37000","max_hp":1220000,"destruction":6,"destruction_limit":400,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":25,"physical_3":250,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":20,"enemy_name":"(17F)ライトバレルウォーカーΩ","enemy_stat":350,"max_dp":"190000","max_hp":255000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":200,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":21,"enemy_name":"(18F)シャドウ・チロル[迅速滅亡]","enemy_stat":350,"max_dp":"68750","max_hp":450000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":25,"physical_3":250,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":22,"enemy_name":"(19F)パープルピラーガーディアン","enemy_stat":350,"max_dp":"63000","max_hp":94000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":250,"element_5":100,"physical_1":50,"physical_2":100,"physical_3":250,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":23,"enemy_name":"(20F)ヒールホッパー","enemy_stat":360,"max_dp":"15000","max_hp":200000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":24,"enemy_name":"(20F)キャットホーンβ","enemy_stat":360,"max_dp":"21250","max_hp":255000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":150,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":25,"enemy_name":"(21F)シャドウ・いちご[フォール・イン・ラヴ]","enemy_stat":360,"max_dp":"44000","max_hp":2600000,"destruction":6,"destruction_limit":600,"element_1":100,"element_2":100,"element_3":250,"element_4":100,"element_5":100,"physical_1":100,"physical_2":250,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":26,"enemy_name":"(22F)スライミーサンダーα","enemy_stat":360,"max_dp":"19000","max_hp":1040000,"destruction":6,"destruction_limit":500,"element_1":250,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":250,"physical_2":50,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":3,"enemy_class_no":27,"enemy_name":"(23F)シャドウ・すもも[光]","enemy_stat":360,"max_dp":"300000","max_hp":120000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":250,"element_4":100,"element_5":100,"physical_1":250,"physical_2":100,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":1,"enemy_name":"(1F)モルアームズα","enemy_stat":380,"max_dp":"200000","max_hp":455000,"destruction":2,"destruction_limit":150,"element_1":200,"element_2":200,"element_3":200,"element_4":200,"element_5":200,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":2,"enemy_name":"(2F)サミットゴーレム","enemy_stat":380,"max_dp":"170000","max_hp":210000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":100,"physical_3":150,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":3,"enemy_name":"(2F)トライクロー","enemy_stat":380,"max_dp":"41600","max_hp":80000,"destruction":5,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":4,"enemy_name":"(2F)カースドール","enemy_stat":380,"max_dp":"68000","max_hp":96000,"destruction":5,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":250,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":5,"enemy_name":"(3F)バレルウォーカー","enemy_stat":380,"max_dp":"170000","max_hp":280000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":150,"physical_2":25,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":6,"enemy_name":"(4F)シャドウ・ユキ[Spitfire]","enemy_stat":380,"max_dp":"950000","max_hp":330000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":7,"enemy_name":"(5F)デススラッグ(第1形態)","enemy_stat":380,"max_dp":"50000","max_hp":300000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":8,"enemy_name":"(5F)デススラッグ(第2形態)","enemy_stat":380,"max_dp":"210000","max_hp":3000000,"destruction":8,"destruction_limit":999,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":9,"enemy_name":"(6F)シュリンプクラブ","enemy_stat":380,"max_dp":"400000","max_hp":180000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":10,"enemy_name":"(7F)シャドウ・緋雨[バレット]","enemy_stat":380,"max_dp":"1500000","max_hp":650000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":11,"enemy_name":"(8F)アビスノッカー","enemy_stat":380,"max_dp":"300000","max_hp":1550000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":150,"physical_2":50,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":12,"enemy_name":"(9F)シャドウ・二以奈[BrandNew]","enemy_stat":380,"max_dp":"150000","max_hp":13500000,"destruction":6,"destruction_limit":999,"element_1":200,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":13,"enemy_name":"(10F)ワイヤーパープルγ","enemy_stat":390,"max_dp":"450000","max_hp":650000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":200,"element_5":100,"physical_1":150,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":14,"enemy_name":"(11F)シャドウ・菅原[ロリータ白書]","enemy_stat":390,"max_dp":"800000","max_hp":1000000,"destruction":6,"destruction_limit":400,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":25,"physical_3":150,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":15,"enemy_name":"(12F)アラクネブルーライン","enemy_stat":390,"max_dp":"1300000","max_hp":2000000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":250,"element_4":100,"element_5":100,"physical_1":100,"physical_2":250,"physical_3":50,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":16,"enemy_name":"(13F)シャドウ・三郷[終局]","enemy_stat":390,"max_dp":"400000","max_hp":3000000,"destruction":6,"destruction_limit":400,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":250,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":17,"enemy_name":"(14F)シェルプロテクシオン","enemy_stat":390,"max_dp":"820000","max_hp":950000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":25,"element_5":150,"physical_1":50,"physical_2":100,"physical_3":150,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":18,"enemy_name":"(15F)ファイアノッカー","enemy_stat":390,"max_dp":"230000","max_hp":1490000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":200,"element_3":100,"element_4":100,"element_5":100,"physical_1":150,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":19,"enemy_name":"(16F)シャドウ・めぐみ[Ikki Burst]","enemy_stat":390,"max_dp":"370000","max_hp":12200000,"destruction":6,"destruction_limit":400,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":25,"physical_3":250,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":20,"enemy_name":"(17F)ライトバレルウォーカーΩ","enemy_stat":390,"max_dp":"1900000","max_hp":2550000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":200,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":21,"enemy_name":"(18F)シャドウ・チロル[迅速滅亡]","enemy_stat":390,"max_dp":"550000","max_hp":3150000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":25,"physical_2":25,"physical_3":250,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":22,"enemy_name":"(19F)パープルピラーガーディアン","enemy_stat":390,"max_dp":"315000","max_hp":470000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":250,"element_5":100,"physical_1":50,"physical_2":100,"physical_3":250,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":23,"enemy_name":"(20F)ヒールホッパー","enemy_stat":400,"max_dp":"120000","max_hp":1600000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":24,"enemy_name":"(20F)キャットホーンβ","enemy_stat":400,"max_dp":"170000","max_hp":2040000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":150,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":25,"enemy_name":"(21F)シャドウ・いちご[フォール・イン・ラヴ]","enemy_stat":400,"max_dp":"860000","max_hp":56500000,"destruction":6,"destruction_limit":600,"element_1":100,"element_2":100,"element_3":250,"element_4":100,"element_5":100,"physical_1":100,"physical_2":250,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":26,"enemy_name":"(22F)スライミーサンダーα","enemy_stat":400,"max_dp":"190000","max_hp":10400000,"destruction":6,"destruction_limit":500,"element_1":250,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":250,"physical_2":50,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":4,"enemy_class_no":27,"enemy_name":"(23F)シャドウ・すもも[光]","enemy_stat":400,"max_dp":"6500000","max_hp":2800000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":250,"element_4":100,"element_5":100,"physical_1":250,"physical_2":100,"physical_3":25,"element_0":100,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":1,"enemy_name":"(10F)アビスノッカーΩ","enemy_stat":280,"max_dp":"20000","max_hp":42000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":75,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":2,"enemy_name":"(20F/48F)バレルウォーカーΩ","enemy_stat":300,"max_dp":"17000","max_hp":26000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":75,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":3,"enemy_name":"(25F)サンダーバレルウォーカーΩ","enemy_stat":310,"max_dp":"31000","max_hp":47000,"destruction":2,"destruction_limit":150,"element_1":200,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":75,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":4,"enemy_name":"(30F)アラクネラインΩ","enemy_stat":320,"max_dp":"41000","max_hp":56000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":5,"enemy_name":"(35F)アイスバレルウォーカーΩ","enemy_stat":330,"max_dp":"31000","max_hp":47000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":200,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":6,"enemy_name":"(40F)ダークバレルウォーカーΩ","enemy_stat":340,"max_dp":"31000","max_hp":47000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":200,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":7,"enemy_name":"(43F)ファイアバレルウォーカーΩ","enemy_stat":345,"max_dp":"31000","max_hp":47000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":200,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":8,"enemy_name":"(45F)ライトバレルウォーカーΩ","enemy_stat":350,"max_dp":"45000","max_hp":68000,"destruction":2,"destruction_limit":150,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":200,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":9,"enemy_name":"(50F)デススラッグΩ(第1形態)","enemy_stat":360,"max_dp":"66000","max_hp":300000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":25,"score_attack_no":null},
    {"enemy_class":5,"enemy_class_no":10,"enemy_name":"(50F)デススラッグΩ(第2形態)","enemy_stat":360,"max_dp":"88000","max_hp":1200000,"destruction":8,"destruction_limit":700,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":25,"score_attack_no":null},
    {"enemy_class":6,"enemy_class_no":1,"enemy_name":"#45 手塚(120)","enemy_stat":360,"max_dp":"974400","max_hp":5324000,"destruction":6,"destruction_limit":400,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":45},
    {"enemy_class":6,"enemy_class_no":2,"enemy_name":"#44 フォーリンハイロゥ(120)","enemy_stat":360,"max_dp":"483000","max_hp":5398000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":250,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":44},
    {"enemy_class":6,"enemy_class_no":3,"enemy_name":"#43 希望を喰むもの(120)","enemy_stat":360,"max_dp":"1619000","max_hp":25935000,"destruction":8,"destruction_limit":999,"element_1":250,"element_2":250,"element_3":250,"element_4":250,"element_5":250,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":43},
    {"enemy_class":6,"enemy_class_no":4,"enemy_name":"#42 フィーラー(120)","enemy_stat":360,"max_dp":"337000,337000,337000","max_hp":10017000,"destruction":8,"destruction_limit":999,"element_1":150,"element_2":150,"element_3":150,"element_4":150,"element_5":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":42},
    {"enemy_class":6,"enemy_class_no":5,"enemy_name":"#41 蒼井えりか(120)","enemy_stat":360,"max_dp":"271000","max_hp":1858000,"destruction":3,"destruction_limit":200,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":41},
    {"enemy_class":6,"enemy_class_no":6,"enemy_name":"#40 コフィンアイ(120)","enemy_stat":360,"max_dp":"464200","max_hp":2504800,"destruction":5,"destruction_limit":300,"element_1":25,"element_2":100,"element_3":150,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":40},
    {"enemy_class":7,"enemy_class_no":1,"enemy_name":"[幻影]アラクネラインA : Lv.16","enemy_stat":400,"max_dp":"157500","max_hp":235000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"score_attack_no":null},
    {"enemy_class":7,"enemy_class_no":2,"enemy_name":"[幻影]アラクネラインA : Lv.15","enemy_stat":380,"max_dp":"117000","max_hp":175000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"score_attack_no":null},
    {"enemy_class":7,"enemy_class_no":3,"enemy_name":"[幻影]アラクネラインA : Lv.14","enemy_stat":360,"max_dp":"82500","max_hp":124000,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"score_attack_no":null},
    {"enemy_class":7,"enemy_class_no":4,"enemy_name":"[幻影]アラクネラインA : Lv.13","enemy_stat":340,"max_dp":"55000","max_hp":82500,"destruction":5,"destruction_limit":300,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"score_attack_no":null},
    {"enemy_class":8,"enemy_class_no":1,"enemy_name":"(X)終焉を告げる邂逅","enemy_stat":340,"max_dp":"200000","max_hp":10000000,"destruction":5,"destruction_limit":999,"element_1":250,"element_2":250,"element_3":250,"element_4":250,"element_5":250,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":8,"enemy_class_no":2,"enemy_name":"(S)終焉を告げる邂逅","enemy_stat":330,"max_dp":"120000","max_hp":4000000,"destruction":5,"destruction_limit":999,"element_1":250,"element_2":250,"element_3":250,"element_4":250,"element_5":250,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":9,"enemy_class_no":1,"enemy_name":"(こじゅ)ユグドヴェイル","enemy_stat":290,"max_dp":"430000","max_hp":4500000,"destruction":5,"destruction_limit":400,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100,"physical_1":150,"physical_2":50,"physical_3":100,"element_0":100,"score_attack_no":null},
    {"enemy_class":9,"enemy_class_no":2,"enemy_name":"(ひさ子)アニマスフィア","enemy_stat":360,"max_dp":"8000000","max_hp":12000000,"destruction":5,"destruction_limit":300,"element_1":250,"element_2":250,"element_3":250,"element_4":250,"element_5":250,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"score_attack_no":null},
];