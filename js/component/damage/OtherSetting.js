const OtherSetting = ({ attackInfo }) => {
    return (
        <div className="surround_area mx-auto my-2 adjust_width">
            <label className="area_title">他設定</label>
            <div className="flex flex-wrap py-1 ml-3 gap-x-4 gap-y-2">
                <div className="flex">
                    <div className="pt-0.5">属性リング</div>
                    <select disabled id="elememt_ring">
                        <option value="0">無し</option>
                        <option value="2">+0(2%)</option>
                        <option value="4">+1(4%)</option>
                        <option value="6">+2(6%)</option>
                        <option value="8">+3(8%)</option>
                        <option value="10">+4(10%)</option>
                    </select>
                </div>
                <div className="flex">
                    <div className="pt-0.5">ピアス</div>
                    <select id="earring">
                        <option value="0">選択無し</option>
                        <option data-effect_size="10" data-type="attack" value="1">
                            アタック10%
                        </option>
                        <option data-effect_size="12" data-type="attack" value="2">
                            アタック12%
                        </option>
                        <option data-effect_size="15" data-type="attack" value="3">
                            アタック15%
                        </option>
                        <option data-effect_size="10" data-type="break" value="4">
                            ブレイク10%
                        </option>
                        <option data-effect_size="12" data-type="break" value="5">
                            ブレイク12%
                        </option>
                        <option data-effect_size="15" data-type="break" value="6">
                            ブレイク15%
                        </option>
                        <option data-effect_size="10" data-type="blast" value="7">
                            ブラスト10%
                        </option>
                        <option data-effect_size="12" data-type="blast" value="8">
                            ブラスト12%
                        </option>
                        <option data-effect_size="15" data-type="blast" value="9">
                            ブラスト15%
                        </option>
                    </select>
                </div>
                <div className="flex">
                    <div className="pt-0.5">チェーン</div>
                    <select id="chain">
                        <option value="0">選択無し</option>
                        <option value="1">火耀</option>
                        <option value="2">銀氷</option>
                    </select>
                </div>
                <input id="overdrive" type="checkbox" />
                <label className="checkbox01" htmlFor="overdrive">
                    オーバードライブ
                </label>
                <input className="ml-3 pt-0.5" id="fightingspirit" type="checkbox" />
                <label className="checkbox01" htmlFor="fightingspirit">
                    闘志
                </label>
                <input className="ml-3 pt-0.5" id="misfortune" type="checkbox" />
                <label className="checkbox01" htmlFor="misfortune">
                    厄
                </label>
                <div className="flex">
                    <div className="pt-0.5">士気</div>
                    <select className="morale" id="morale_count">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <input className="ml-3 pt-0.5" id="eternal_vows" type="checkbox" />
                <label className="checkbox01" htmlFor="eternal_vows">
                    永遠なる誓い
                </label>
                <input className="ml-3 pt-0.5" id="babied" type="checkbox" />
                <label className="checkbox01" htmlFor="babied">
                    オギャり
                </label>
                <input className="ml-3 pt-0.5" id="hacking" type="checkbox" />
                <label className="checkbox01" htmlFor="hacking">
                    ハッキング
                </label>
            </div>
        </div>
    )
};
