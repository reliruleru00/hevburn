const OtherSetting = ({ attackInfo, otherSetting, setOtherSetting }) => {
    React.useEffect(() => {
        if (attackInfo?.attack_element === 0 && otherSetting.ring !== 0) {
            setOtherSetting((prev) => ({ ...prev, ring: 0 }));
        }
    }, [attackInfo?.attack_element]);

    return (
        <div className="surround_area mx-auto my-2 adjust_width">
            <label className="area_title">他設定</label>
            <div className="flex flex-wrap py-1 ml-3 gap-x-4 gap-y-2">
                <div className="flex">
                    <div className="pt-0.5">属性リング</div>
                    <select disabled={attackInfo?.attack_element === 0} value={otherSetting.ring} onChange={(e) => setOtherSetting({ ...otherSetting, ring: e.target.value })}>
                        <option value="0">無し</option>
                        {attackInfo?.attack_element !== 0 && (
                            <>
                                <option value="2">+0(2%)</option>
                                <option value="4">+1(4%)</option>
                                <option value="6">+2(6%)</option>
                                <option value="8">+3(8%)</option>
                                <option value="10">+4(10%)</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="flex">
                    <div className="pt-0.5">ピアス</div>
                    <select value={otherSetting.earring} onChange={(e) => setOtherSetting({ ...otherSetting, earring: e.target.value })}>
                        <option value="0">選択無し</option>
                        <option value="attack_10">アタック10%</option>
                        <option value="attack_12">アタック12%</option>
                        <option value="attack_15">アタック15%</option>
                        <option value="break_10">ブレイク10%</option>
                        <option value="break_12">ブレイク12%</option>
                        <option value="break_15">ブレイク15%</option>
                        <option value="blast_10">ブラスト10%</option>
                        <option value="blast_12">ブラスト12%</option>
                        <option value="blast_15">ブラスト15%</option>
                    </select>
                </div>
                <div className="flex">
                    <div className="pt-0.5">チェーン</div>
                    <select value={otherSetting.chain} onChange={(e) => setOtherSetting({ ...otherSetting, chain: e.target.value })}>
                        <option value="0">選択無し</option>
                        <option value="1">火耀</option>
                        <option value="2">銀氷</option>
                        <option value="3">雷霆</option>
                    </select>
                </div>
                <input id="overdrive" type="checkbox" checked={otherSetting.overdrive} onChange={(e) => setOtherSetting({ ...otherSetting, overdrive: e.target.checked })} />
                <label className="checkbox01" htmlFor="overdrive">
                    オーバードライブ
                </label>
                {/* <input className="ml-3 pt-0.5" id="fightingspirit" type="checkbox" />
                <label className="checkbox01" htmlFor="fightingspirit">
                    闘志
                </label>
                <input className="ml-3 pt-0.5" id="misfortune" type="checkbox" />
                <label className="checkbox01" htmlFor="misfortune">
                    厄
                </label>
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
                </label> */}
            </div>
        </div>
    )
};
