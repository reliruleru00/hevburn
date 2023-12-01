﻿let enemy_list = [
    {"enemy_class":1,"enemy_class_no":1,"enemy_name":"デススラッグ（第1形態）","enemy_stat":290,"max_dp":66000,"max_hp":300000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":1,"enemy_class_no":2,"enemy_name":"デススラッグ（第2形態）","enemy_stat":290,"max_dp":88000,"max_hp":1680000,"destruction":8,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":1,"enemy_class_no":3,"enemy_name":"ロータリーモール(第1形態）","enemy_stat":310,"max_dp":97600,"max_hp":999999,"destruction":3,"destruction_limit":300,"physical_1":100,"physical_2":150,"physical_3":50,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":1,"enemy_class_no":4,"enemy_name":"ロータリーモール(第2形態）","enemy_stat":310,"max_dp":195000,"max_hp":1842800,"destruction":6,"destruction_limit":999,"physical_1":100,"physical_2":150,"physical_3":50,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":1,"enemy_class_no":5,"enemy_name":"レッドクリムゾン","enemy_stat":270,"max_dp":225000,"max_hp":5002200,"destruction":8,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":1,"enemy_class_no":6,"enemy_name":"フィーラー","enemy_stat":290,"max_dp":450000,"max_hp":10200000,"destruction":8,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":150,"element_2":150,"element_3":150,"element_4":150,"element_5":150},
    {"enemy_class":1,"enemy_class_no":7,"enemy_name":"フラットハンド(3章/第1形態)","enemy_stat":320,"max_dp":275000,"max_hp":1875000,"destruction":6,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":150,"element_2":150,"element_3":150,"element_4":150,"element_5":150},
    {"enemy_class":1,"enemy_class_no":8,"enemy_name":"フラットハンド(3章/第2形態）","enemy_stat":320,"max_dp":350000,"max_hp":8625000,"destruction":10,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":150,"element_5":150},
    {"enemy_class":1,"enemy_class_no":9,"enemy_name":"アルティメットフィーラー","enemy_stat":320,"max_dp":500000,"max_hp":15000000,"destruction":10,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":150,"element_2":150,"element_3":150,"element_4":150,"element_5":150},
    {"enemy_class":1,"enemy_class_no":10,"enemy_name":"フラットハンド(4章前半)","enemy_stat":380,"max_dp":1000000,"max_hp":38000000,"destruction":10,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":1,"enemy_class_no":11,"enemy_name":"デザートデンドロン","enemy_stat":380,"max_dp":4452000,"max_hp":183274000,"destruction":10,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"element_1":100,"element_2":250,"element_3":100,"element_4":100,"element_5":250},
    {"enemy_class":2,"enemy_class_no":1,"enemy_name":"エグゾウォッチャーR : Lv.3","enemy_stat":320,"max_dp":65000,"max_hp":300000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":25,"element_2":200,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":2,"enemy_class_no":2,"enemy_name":"エグゾウォッチャーB : Lv.3","enemy_stat":320,"max_dp":65000,"max_hp":300000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":25,"element_3":200,"element_4":100,"element_5":100},
    {"enemy_class":2,"enemy_class_no":3,"enemy_name":"エグゾウォッチャーY : Lv.3","enemy_stat":320,"max_dp":65000,"max_hp":300000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":200,"element_2":100,"element_3":25,"element_4":100,"element_5":100},
    {"enemy_class":2,"enemy_class_no":4,"enemy_name":"エグゾウォッチャーW : Lv.3","enemy_stat":320,"max_dp":65000,"max_hp":300000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":25,"element_5":200},
    {"enemy_class":2,"enemy_class_no":5,"enemy_name":"エグゾウォッチャーP : Lv.3","enemy_stat":320,"max_dp":65000,"max_hp":300000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":200,"element_5":25},
    {"enemy_class":2,"enemy_class_no":6,"enemy_name":"レクタス/シニスター・ニールR : Lv.3","enemy_stat":340,"max_dp":150000,"max_hp":700000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":25,"element_2":250,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":2,"enemy_class_no":7,"enemy_name":"レクタス/シニスター・ニールB : Lv.3","enemy_stat":340,"max_dp":150000,"max_hp":700000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":25,"element_3":250,"element_4":100,"element_5":100},
    {"enemy_class":2,"enemy_class_no":8,"enemy_name":"レクタス/シニスター・ニールY : Lv.3","enemy_stat":340,"max_dp":150000,"max_hp":700000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":250,"element_2":100,"element_3":25,"element_4":100,"element_5":100},
    {"enemy_class":2,"enemy_class_no":9,"enemy_name":"レクタス/シニスター・ニールW : Lv.3","enemy_stat":340,"max_dp":150000,"max_hp":700000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":25,"element_5":250},
    {"enemy_class":2,"enemy_class_no":10,"enemy_name":"レクタス/シニスター・ニールP : Lv.3","enemy_stat":340,"max_dp":150000,"max_hp":700000,"destruction":4,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":250,"element_5":25},
    {"enemy_class":3,"enemy_class_no":1,"enemy_name":"(1F)モルアームズα","enemy_stat":340,"max_dp":30000,"max_hp":45500,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"element_1":200,"element_2":200,"element_3":200,"element_4":200,"element_5":200},
    {"enemy_class":3,"enemy_class_no":2,"enemy_name":"(2F)サミットゴーレム","enemy_stat":340,"max_dp":20000,"max_hp":42000,"destruction":2,"destruction_limit":150,"physical_1":25,"physical_2":100,"physical_3":150,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":3,"enemy_name":"(2F)トライクロー","enemy_stat":340,"max_dp":8320,"max_hp":16000,"destruction":5,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":4,"enemy_name":"(2F)カースドール","enemy_stat":340,"max_dp":13600,"max_hp":19200,"destruction":5,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":250,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":5,"enemy_name":"(3F)バレルウォーカー","enemy_stat":340,"max_dp":46000,"max_hp":70000,"destruction":2,"destruction_limit":150,"physical_1":150,"physical_2":25,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":6,"enemy_name":"(4F)シャドウ・ユキ[Spitfire]","enemy_stat":340,"max_dp":110000,"max_hp":66000,"destruction":2,"destruction_limit":150,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":7,"enemy_name":"(5F)デススラッグ(第1形態)","enemy_stat":340,"max_dp":20000,"max_hp":60000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":8,"enemy_name":"(5F)デススラッグ(第2形態)","enemy_stat":340,"max_dp":42000,"max_hp":600000,"destruction":8,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":9,"enemy_name":"(6F)シュリンプクラブ","enemy_stat":340,"max_dp":41000,"max_hp":30000,"destruction":2,"destruction_limit":150,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":10,"enemy_name":"(7F)シャドウ・緋雨[バレット]","enemy_stat":340,"max_dp":150000,"max_hp":100000,"destruction":2,"destruction_limit":150,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":11,"enemy_name":"(8F)アビスノッカー","enemy_stat":340,"max_dp":50000,"max_hp":155000,"destruction":5,"destruction_limit":300,"physical_1":150,"physical_2":50,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":12,"enemy_name":"(9F)シャドウ・二以奈[BrandNew]","enemy_stat":340,"max_dp":30000,"max_hp":1350000,"destruction":6,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":200,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":13,"enemy_name":"(10F)ワイヤーパープルγ","enemy_stat":350,"max_dp":45000,"max_hp":65000,"destruction":2,"destruction_limit":150,"physical_1":150,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":200,"element_5":100},
    {"enemy_class":3,"enemy_class_no":14,"enemy_name":"(11F)シャドウ・菅原[ロリータ白書]","enemy_stat":350,"max_dp":80000,"max_hp":100000,"destruction":6,"destruction_limit":400,"physical_1":25,"physical_2":25,"physical_3":150,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":15,"enemy_name":"(12F)アラクネブルーライン","enemy_stat":350,"max_dp":100000,"max_hp":150000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":250,"physical_3":50,"element_0":100,"element_1":100,"element_2":100,"element_3":250,"element_4":100,"element_5":100},
    {"enemy_class":3,"enemy_class_no":16,"enemy_name":"(13F)シャドウ・三郷[終局]","enemy_stat":350,"max_dp":40000,"max_hp":300000,"destruction":6,"destruction_limit":400,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":250},
    {"enemy_class":3,"enemy_class_no":17,"enemy_name":"(14F)シェルプロテクシオン","enemy_stat":350,"max_dp":75000,"max_hp":95000,"destruction":5,"destruction_limit":300,"physical_1":50,"physical_2":100,"physical_3":150,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":25,"element_5":150},
    {"enemy_class":4,"enemy_class_no":1,"enemy_name":"(1F)モルアームズα","enemy_stat":380,"max_dp":200000,"max_hp":455000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"element_1":200,"element_2":200,"element_3":200,"element_4":200,"element_5":200},
    {"enemy_class":4,"enemy_class_no":2,"enemy_name":"(2F)サミットゴーレム","enemy_stat":380,"max_dp":170000,"max_hp":210000,"destruction":2,"destruction_limit":150,"physical_1":25,"physical_2":100,"physical_3":150,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":3,"enemy_name":"(2F)トライクロー","enemy_stat":380,"max_dp":41600,"max_hp":80000,"destruction":5,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":4,"enemy_name":"(2F)カースドール","enemy_stat":380,"max_dp":68000,"max_hp":96000,"destruction":5,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":250,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":5,"enemy_name":"(3F)バレルウォーカー","enemy_stat":380,"max_dp":170000,"max_hp":280000,"destruction":2,"destruction_limit":150,"physical_1":150,"physical_2":25,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":6,"enemy_name":"(4F)シャドウ・ユキ[Spitfire]","enemy_stat":380,"max_dp":950000,"max_hp":330000,"destruction":2,"destruction_limit":150,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":7,"enemy_name":"(5F)デススラッグ(第1形態)","enemy_stat":380,"max_dp":50000,"max_hp":300000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":8,"enemy_name":"(5F)デススラッグ(第2形態)","enemy_stat":380,"max_dp":210000,"max_hp":3000000,"destruction":8,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":9,"enemy_name":"(6F)シュリンプクラブ","enemy_stat":380,"max_dp":400000,"max_hp":180000,"destruction":2,"destruction_limit":150,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":10,"enemy_name":"(7F)シャドウ・緋雨[バレット]","enemy_stat":380,"max_dp":1500000,"max_hp":650000,"destruction":2,"destruction_limit":150,"physical_1":25,"physical_2":150,"physical_3":25,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":11,"enemy_name":"(8F)アビスノッカー","enemy_stat":380,"max_dp":300000,"max_hp":1550000,"destruction":5,"destruction_limit":300,"physical_1":150,"physical_2":50,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":12,"enemy_name":"(9F)シャドウ・二以奈[BrandNew]","enemy_stat":380,"max_dp":150000,"max_hp":13500000,"destruction":6,"destruction_limit":999,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":200,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":13,"enemy_name":"(10F)ワイヤーパープルγ","enemy_stat":390,"max_dp":450000,"max_hp":650000,"destruction":2,"destruction_limit":150,"physical_1":150,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":200,"element_5":100},
    {"enemy_class":4,"enemy_class_no":14,"enemy_name":"(11F)シャドウ・菅原[ロリータ白書]","enemy_stat":390,"max_dp":800000,"max_hp":1000000,"destruction":6,"destruction_limit":400,"physical_1":25,"physical_2":25,"physical_3":150,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":15,"enemy_name":"(12F)アラクネブルーライン","enemy_stat":390,"max_dp":1300000,"max_hp":2000000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":250,"physical_3":50,"element_0":100,"element_1":100,"element_2":100,"element_3":250,"element_4":100,"element_5":100},
    {"enemy_class":4,"enemy_class_no":16,"enemy_name":"(13F)シャドウ・三郷[終局]","enemy_stat":390,"max_dp":400000,"max_hp":3000000,"destruction":6,"destruction_limit":400,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":250},
    {"enemy_class":4,"enemy_class_no":17,"enemy_name":"(14F)シェルプロテクシオン","enemy_stat":390,"max_dp":820000,"max_hp":950000,"destruction":5,"destruction_limit":300,"physical_1":50,"physical_2":100,"physical_3":150,"element_0":100,"element_1":100,"element_2":100,"element_3":100,"element_4":25,"element_5":150},
    {"enemy_class":5,"enemy_class_no":1,"enemy_name":"(10F)アビスノッカーΩ","enemy_stat":280,"max_dp":20000,"max_hp":42000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":75,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":5,"enemy_class_no":2,"enemy_name":"(20F/48F)バレルウォーカーΩ","enemy_stat":300,"max_dp":17000,"max_hp":26000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":75,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":5,"enemy_class_no":3,"enemy_name":"(25F)サンダーバレルウォーカーΩ","enemy_stat":310,"max_dp":31000,"max_hp":47000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":75,"element_1":200,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":5,"enemy_class_no":4,"enemy_name":"(30F)アラクネラインΩ","enemy_stat":320,"max_dp":41000,"max_hp":56000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":5,"enemy_class_no":5,"enemy_name":"(35F)アイスバレルウォーカーΩ","enemy_stat":330,"max_dp":31000,"max_hp":47000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"element_1":100,"element_2":100,"element_3":200,"element_4":100,"element_5":100},
    {"enemy_class":5,"enemy_class_no":6,"enemy_name":"(40F)ダークバレルウォーカーΩ","enemy_stat":340,"max_dp":31000,"max_hp":47000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"element_1":100,"element_2":100,"element_3":100,"element_4":200,"element_5":100},
    {"enemy_class":5,"enemy_class_no":7,"enemy_name":"(43F)ファイアバレルウォーカーΩ","enemy_stat":345,"max_dp":31000,"max_hp":47000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"element_1":100,"element_2":200,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":5,"enemy_class_no":8,"enemy_name":"(45F)ライトバレルウォーカーΩ","enemy_stat":350,"max_dp":45000,"max_hp":68000,"destruction":2,"destruction_limit":150,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":50,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":200},
    {"enemy_class":5,"enemy_class_no":9,"enemy_name":"(50F)デススラッグΩ(第1形態)","enemy_stat":360,"max_dp":66000,"max_hp":300000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":25,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":5,"enemy_class_no":10,"enemy_name":"(50F)デススラッグΩ(第2形態)","enemy_stat":360,"max_dp":88000,"max_hp":1200000,"destruction":8,"destruction_limit":700,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":25,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":6,"enemy_class_no":1,"enemy_name":"アシッドサーペント(120)(仮)","enemy_stat":360,"max_dp":528000,"max_hp":6360000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":150,"physical_3":150,"element_0":100,"element_1":100,"element_2":250,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":6,"enemy_class_no":2,"enemy_name":"アシッドサーペント(100)(仮)","enemy_stat":290,"max_dp":440000,"max_hp":5300000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":150,"physical_3":150,"element_0":100,"element_1":100,"element_2":250,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":6,"enemy_class_no":3,"enemy_name":"フローシェスノッカー(120)","enemy_stat":360,"max_dp":528000,"max_hp":6360000,"destruction":6,"destruction_limit":500,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":150,"element_3":150,"element_4":100,"element_5":100},
    {"enemy_class":6,"enemy_class_no":4,"enemy_name":"フローシェスノッカー(100)","enemy_stat":290,"max_dp":440000,"max_hp":5300000,"destruction":6,"destruction_limit":500,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":150,"element_3":150,"element_4":100,"element_5":100},
    {"enemy_class":6,"enemy_class_no":5,"enemy_name":"ニンブルホース(120)","enemy_stat":400,"max_dp":290000,"max_hp":9600000,"destruction":5,"destruction_limit":300,"physical_1":50,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":250,"element_4":250,"element_5":100},
    {"enemy_class":6,"enemy_class_no":6,"enemy_name":"ニンブルホース(100)","enemy_stat":340,"max_dp":75000,"max_hp":6300000,"destruction":5,"destruction_limit":300,"physical_1":50,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":100,"element_3":250,"element_4":250,"element_5":100},
    {"enemy_class":6,"enemy_class_no":7,"enemy_name":"アイシクルスラッグ(120)","enemy_stat":360,"max_dp":528000,"max_hp":6360000,"destruction":6,"destruction_limit":500,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":25,"element_3":150,"element_4":100,"element_5":100},
    {"enemy_class":6,"enemy_class_no":8,"enemy_name":"アイシクルスラッグ(100)","enemy_stat":290,"max_dp":440000,"max_hp":5300000,"destruction":6,"destruction_limit":500,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":100,"element_1":100,"element_2":25,"element_3":150,"element_4":100,"element_5":100},
    {"enemy_class":7,"enemy_class_no":1,"enemy_name":"[幻影]アラクネラインA : Lv.16","enemy_stat":400,"max_dp":157500,"max_hp":235000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":7,"enemy_class_no":2,"enemy_name":"[幻影]アラクネラインA : Lv.15","enemy_stat":380,"max_dp":117000,"max_hp":175000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":7,"enemy_class_no":3,"enemy_name":"[幻影]アラクネラインA : Lv.14","enemy_stat":360,"max_dp":82500,"max_hp":124000,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
    {"enemy_class":7,"enemy_class_no":4,"enemy_name":"[幻影]アラクネラインA : Lv.13","enemy_stat":340,"max_dp":55000,"max_hp":82500,"destruction":5,"destruction_limit":300,"physical_1":100,"physical_2":100,"physical_3":100,"element_0":10,"element_1":100,"element_2":100,"element_3":100,"element_4":100,"element_5":100},
];