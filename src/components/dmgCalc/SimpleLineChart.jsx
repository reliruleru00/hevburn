import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Label, Tooltip } from 'recharts';
import { calcBuffEffectSize, calcDebuffEffectSize } from './logic'


export function BuffLineChart({ buffInfo, status, jewelLv, skillLv }) {
    const data = [];
    const skillStat = buffInfo.param_limit;
    const minPower = buffInfo.min_power * (1 + 0.03 * (skillLv - 1));
    const maxPower = buffInfo.max_power * (1 + 0.02 * (skillLv - 1));
    const tickMinPower = Math.floor(minPower + buffInfo.min_power * (jewelLv * 0.04));
    const tickMaxPower = Math.floor(maxPower + buffInfo.max_power * (jewelLv * 0.04));

    let min = 0;
    let max = Math.max(status, skillStat + 300) + 30;
    for (let x = min; x <= max; x++) {
        data.push({ x: x, y: calcBuffEffectSize(buffInfo, x, skillLv, jewelLv) });
    }

    return (
        <LineChart width={400} height={300} data={data} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" domain={['dataMin', 'dataMax']} interval={49}>
                <Label value="ステータス" offset={40} position="insideBottom" />
            </XAxis>
            <YAxis domain={[tickMinPower * 0.9, tickMaxPower * 1.1]} ticks={[tickMinPower, tickMaxPower]}
                tickFormatter={(value) => `${value}%`} width={40} >
                <Label value="効果量" offset={55} angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="y" stroke="#ff3333" strokeWidth={2} dot={false} />

            <ReferenceLine x={status} stroke="deepskyblue" strokeWidth={2}>
                <Label value={status} position="top" fill="deepskyblue" fontSize={24} />
            </ReferenceLine>
        </LineChart>
    );
}

export function DebuffLineChart({ buffInfo, status, enemyStat, jewelLv }) {
    const data = [];
    const skillStat = buffInfo.param_limit;
    const baseMinPower = buffInfo.min_power;
    const baseMaxPower = buffInfo.max_power;
    const tickMinPower = Math.floor(baseMinPower * (1 + jewelLv * 0.02));
    const tickMaxPower = Math.floor(baseMaxPower * (1 + jewelLv * 0.02));

    let min = Math.min(status, enemyStat) - 30;
    let max = Math.max(status, enemyStat + skillStat + 100) + 30;
    for (let x = min; x <= max; x++) {
        data.push({ x: x, y: calcDebuffEffectSize(x, enemyStat, skillStat, baseMinPower, baseMaxPower, 1, jewelLv) });
    }

    return (
        <LineChart width={400} height={300} data={data} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" domain={['dataMin', 'dataMax']} interval={49}>
                <Label value="ステータス" offset={40} position="insideBottom" />
            </XAxis>
            <YAxis domain={[tickMinPower * 0.9, tickMaxPower * 1.1]} ticks={[tickMinPower, tickMaxPower]}
                tickFormatter={(value) => `${value}%`} width={40} >
                <Label value="効果量" offset={20} angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="y" stroke="#ff3333" strokeWidth={2} dot={false} />

            <ReferenceLine x={status} stroke="deepskyblue" strokeWidth={2}>
                <Label value={status} position="top" fill="deepskyblue" fontSize={24} />
            </ReferenceLine>
        </LineChart>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const point = payload[0].payload; // データ全体
        return (
            <div style={{ backgroundColor: '#fff', padding: 10, border: '1px solid #ccc' }}>
                <p><strong>{point.x}:</strong> {`${Math.floor(point.y * 100) / 100}%`}</p>
                {/* 必要に応じて他のフィールドや条件分岐も追加可能 */}
            </div>
        );
    }

    return null;
};