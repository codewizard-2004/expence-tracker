import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View, } from "react-native";

type TripBudgetProps = {
    totalBudget: number;
    currency: string;
    amountSpent: number;
    remaining: number;
    progress: number;
}

const TripBudgetCard = ({ totalBudget, currency, amountSpent, remaining, progress }: TripBudgetProps) => {
    return (
        <View className="rounded-[24px] overflow-hidden mb-8 shadow-lg shadow-primary/10">
            <LinearGradient
                colors={['#630ED4', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-6"
                style={{ borderRadius: 24 }}
            >
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-white/70 font-label text-[10px] uppercase tracking-widest font-bold">
                        Total Budget
                    </Text>
                    <View className="w-8 h-8 rounded-xl bg-white/20 items-center justify-center">
                        <MaterialIcons name="account-balance-wallet" size={16} color="white" />
                    </View>
                </View>
                <Text className="font-headline font-extrabold text-3xl text-white mb-5">
                    {currency}{totalBudget.toLocaleString()}
                </Text>

                {/* Progress */}
                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-white/80 font-body text-xs font-semibold">
                            Spending Progress
                        </Text>
                        <Text className="text-white font-body text-xs font-bold">
                            {progress}%
                        </Text>
                    </View>
                    <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-secondary-container rounded-full"
                            style={{ width: '68%' }}
                        />
                    </View>
                </View>

                {/* Amount Spent / Remaining */}
                <View className="flex-row justify-between pt-2">
                    <View>
                        <Text className="text-white/60 font-label text-[10px] uppercase tracking-widest font-bold mb-1">
                            Amount Spent
                        </Text>
                        <Text className="text-white font-headline font-bold text-lg">
                            {currency}{amountSpent.toLocaleString()}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-white/60 font-label text-[10px] uppercase tracking-widest font-bold mb-1">
                            Remaining
                        </Text>
                        <Text className="text-white font-headline font-bold text-lg">
                            {currency}{remaining.toLocaleString()}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    )
}

export default TripBudgetCard