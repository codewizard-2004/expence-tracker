import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type TotalSpendCardProps = {
    amount: number;
    currency: string;
    percentageChange: number;

}

const TotalSpendCard = ({ amount, currency, percentageChange }: TotalSpendCardProps) => {
    return (
        <TouchableOpacity className="shadow-xl shadow-primary/20 rounded-[24px] overflow-hidden" activeOpacity={0.9}>
            <LinearGradient
                colors={['#630ED4', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-8"
                style={{ borderRadius: 24 }}
            >
                <View className="flex-row justify-between items-start mb-6">
                    <Text className="font-label text-xs uppercase tracking-widest text-white/80 font-bold">
                        Total Monthly Spend
                    </Text>
                    <MaterialIcons name="account-balance-wallet" size={20} color="rgba(255,255,255,0.8)" />
                </View>
                <Text className="text-4xl font-headline font-extrabold text-white mb-4">
                    {currency}{amount.toFixed(2)}
                </Text>
                <View className="flex-row items-center gap-2 bg-white/20 self-start px-3 py-1.5 rounded-full">
                    <MaterialIcons name={percentageChange > 0 ? "trending-up" : "trending-down"} size={14} color="white" />
                    <Text className="text-white text-xs font-semibold">
                        {percentageChange}% from last month
                    </Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default TotalSpendCard