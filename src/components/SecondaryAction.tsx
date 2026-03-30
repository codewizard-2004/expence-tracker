import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import {
    Text,
    TouchableOpacity,
    View
} from "react-native"

const SecondaryAction = () => {
    return (
        <View className="bg-surface-container rounded-3xl p-8 pb-10 items-center border border-outline-variant/10">
            <Text className="font-headline font-extrabold text-2xl text-on-surface mb-3 text-center">
                Found a new expense?
            </Text>
            <Text className="text-on-surface-variant font-medium text-center mb-8 px-2 leading-relaxed">
                Capture your receipts instantly. Our AI will automatically categorize and match them to your active trips.
            </Text>

            <TouchableOpacity className="shadow-lg shadow-secondary/30 rounded-[24px] w-full overflow-hidden" activeOpacity={0.9}>
                <LinearGradient
                    colors={['#ab3500', '#fe6a34']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-row items-center justify-center gap-3 py-4"
                    style={{ borderRadius: 24 }}
                >
                    <MaterialIcons name="cloud-upload" size={24} color="white" />
                    <Text className="text-white font-headline font-bold text-lg">
                        Upload Receipt
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}

export default SecondaryAction