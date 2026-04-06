import { Text, View } from "react-native";
import { Circle, G, Svg } from "react-native-svg";


function DonutChart({ size = 180, strokeWidth = 28, EXPENSE_DATA, TOTAL_SPEND }: { size?: number; strokeWidth?: number, EXPENSE_DATA: any, TOTAL_SPEND: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const cx = size / 2;
    const cy = size / 2;

    // Build arcs: each segment is an offset along the circle
    let cumulativeOffset = 0;
    // Start from the top (-90deg rotation applied via G transform)
    const segments = EXPENSE_DATA.map((seg: any) => {
        const segLen = (seg.pct / 100) * circumference;
        const gap = EXPENSE_DATA.length > 1 ? 4 : 0; // only gap if multiple segments
        const dash1 = Math.max(0, segLen - gap);
        const dash2 = Math.max(0, circumference - dash1);
        const dash = `${dash1} ${dash2}`;
        const offset = -cumulativeOffset;
        cumulativeOffset += segLen;
        return { ...seg, dash, offset };
    });

    return (
        <View className="items-center justify-center" style={{ width: size, height: size }}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background track */}
                <Circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    stroke="#EDE5F4"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Rotate so arcs start from 12 o'clock */}
                <G rotation={-90} origin={`${cx}, ${cy}`}>
                    {segments.map((seg: any, i: any) => (
                        <Circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r={radius}
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={seg.dash}
                            strokeDashoffset={seg.offset}
                            strokeLinecap="round"
                            fill="none"
                        />
                    ))}
                </G>
            </Svg>
            {/* Center label */}
            <View className="absolute items-center justify-center">
                <Text className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant font-bold">
                    Total Spend
                </Text>
                <Text className="font-headline font-extrabold text-2xl text-on-surface">
                    ${TOTAL_SPEND.toLocaleString()}
                </Text>
            </View>
        </View>
    );
}

export default DonutChart;