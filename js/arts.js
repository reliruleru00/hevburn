// イベントトリガー設定
function setEventTrigger() {
    // スタイルクリック
    $(".select_arts").on('click', function () {
        let select = $(this).data("select");
        let troops = $(this).data("troops");
        
        if (select == "1") {
            released($(this), troops);
            select_count -= 1;
        } else {
            selected($(this), troops);
            select_count += 1;
        }
        // $("#style_select").text(select_count);
        // setRateComplate();
    });
    // 全選択
    $("#btn_select").on('click', function () {
        $(".select_arts").each(function (index, value) {
            selected($(this));
        });
        select_count = arts_list_.length;
        // $("#select_arts").text(select_count);
        // setRateComplate();
    });
    // 全解除
    $("#btn_release").on('click', function () {
        $(".select_arts").each(function (index, value) {
            released($(this));
        });
        select_count = 0;
        // $("#style_select").text(select_count);
        // setRateComplate();
    });

    //生成ボタン
    $('#openModalBtn').click(function () {
        $('#modalOverlay, #modalContent').fadeIn();

        combineImagesWithHatching(null);

    });

    // モーダル解除
    $('#modalOverlay').click(function () {
        $('#modalOverlay, #modalContent').fadeOut();
    });
}

// 選択
function selected(item, troops) {
    item.css("opacity", "1");
    item.data("select", "1");
    saveLocalStrage(troops);
}

// 解除
function released(item, troops) {
    item.css("opacity", "0.3");
    item.data("select", "0");
    saveLocalStrage(troops);
}

// 保存
function saveLocalStrage(troops) {
    if (!troops) {
        return;
    }
    let selectValues = [];
    $('#arts_list_' + troops).children().each(function() {
        selectValues.push($(this).data('select'));
    });
    localStorage.setItem("arts_select_" + troops, selectValues.join(','));
}

// アーツリスト作成
function createArtsList() {
    let arts_select_list = new Object();
    $.each(troop_list, function (index, value) {
        arts_select = localStorage.getItem("arts_select_" + value);
        if (arts_select) {
            arts_select_list[value] = arts_select.split(",");
        } else {
            arts_select_list[value] = Array(18).fill(0);
        }
    });
    $.each(arts_list, function (index, value) {
        let source = "arts/" + value.image_url;
        let opacity = 0.3;
        let select = arts_select_list[value.troops][index % 18];
        if (select == "1") {
            select_count += 1;
            opacity = 1;
        }

        let input = $('<input>')
            .attr("type", "image")
            .attr("src", source)
            .data("select", select)
            .data("troops", value.troops)
            .addClass("select_arts")
            .css("opacity", opacity);
        $("#arts_list_" + value.troops.replace("!", "")).append(input);
    });
    // $("#style_all").text(style_list.length);
    // $("#style_select").text(select_count);
    // setRateComplate();
}


// 画像を生成して Canvas に描画する関数
function combineImagesWithHatching(create_style) {
    var canvasContainer = $('#canvas-container');
    canvasContainer.empty(); // コンテナをクリア
    var canvas = $('<canvas>');
    var context = canvas[0].getContext('2d');

    // Canvas サイズを設定
    var columns = 12;
    var rows = Math.ceil(arts_list.length / columns);
    // 画像の横幅と高さを半分に縮小
    var scaledWidth = 512 / 4;
    var scaledHeight = 702 / 4;
    canvas[0].width = scaledWidth * columns;
    canvas[0].height = scaledHeight * rows;

    // Canvas をコンテナに追加
    canvasContainer.append(canvas);

    // 画像をロードして描画
    var loadedImages = 0;

    function loadImageAndDraw(index, arts_info) {
        var img = $('<img>');
        let select = "1";
        img[0].onload = function () {
            var row = Math.floor(index / columns);
            var col = index % columns;
            context.drawImage(img[0], col * scaledWidth, row * scaledHeight, scaledWidth, scaledHeight);

            // 未所持の場合網掛けを描画
            if (select != "1") {
                drawHatching(context, col * scaledWidth, row * scaledHeight, scaledWidth, scaledHeight);
            }
            loadedImages++;
        };
        img[0].src = "arts/" + arts_info.image_url;
    }

    // 画像をロードして描画
    for (var i = 0; i < arts_list.length; i++) {
        loadImageAndDraw(i, arts_list[i]);
    }

    // canvasを画像として保存する
    var link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
}

// 網掛けを描画する関数
function drawHatching(context, pos_x, pos_y, width, height) {
    context.beginPath();
    for (var x = 0; x < width; x += 2) {
        context.moveTo(x + pos_x, pos_y);
        context.lineTo(x + pos_x, height + pos_y);
    }
    for (var y = 0; y < height; y += 2) {
        context.moveTo(pos_x, y + pos_y);
        context.lineTo(width + pos_x, y + pos_y);
    }
    context.strokeStyle = 'rgba(0, 0, 0, 1)';
    context.stroke();
}