var enemy_list = [
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
    ];