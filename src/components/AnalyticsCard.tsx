import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import DonutChart from "./DonutChart";


const AnalyticsCard = ({ EXPENSE_DATA, TOTAL_SPEND }: { EXPENSE_DATA: any, TOTAL_SPEND: number }) => {
    return (
        <>
            <View className="bg-surface-container-low rounded-[24px] p-6 items-center mb-6">
                <DonutChart EXPENSE_DATA={EXPENSE_DATA} TOTAL_SPEND={TOTAL_SPEND} />
            </View>

            <View className="gap-3">
                {EXPENSE_DATA.map((cat: any, idx: number) => (
                    <View
                        key={idx}
                        className="flex-row items-center bg-surface-container-low rounded-2xl p-4 gap-4"
                    >
                        <View
                            className="w-10 h-10 rounded-xl items-center justify-center"
                            style={{ backgroundColor: cat.color + '18' }}
                        >
                            <MaterialIcons name={cat.icon} size={20} color={cat.color} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-body font-bold text-sm text-on-surface">
                                {cat.label}
                            </Text>
                            <View className="flex-row items-center gap-2 mt-0.5">
                                <Text className="font-label text-[10px] text-on-surface-variant">
                                    {cat.subtitle}
                                </Text>
                                <View className="bg-primary-fixed px-1.5 py-0.5 rounded-full">
                                    <Text className="text-[9px] font-label font-bold text-primary">
                                        {cat.pct}%
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text className="font-headline font-bold text-base text-on-surface">
                            ${cat.amount.toLocaleString()}
                        </Text>
                    </View>
                ))}

            </View>
        </>
    )
}

export default AnalyticsCard;