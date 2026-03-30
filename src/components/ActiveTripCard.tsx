import { MaterialIcons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"

type ActiveTripCardProps = {
    image: any;
    title: string;
    location: string;
    budget: number;
    spent: number;
    startDate: string;
    endDate: string;
    currency: string;
}

const ActiveTripCard = ({ image, title, location, budget, spent, currency, startDate, endDate, }: ActiveTripCardProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity activeOpacity={0.9} className="relative rounded-3xl overflow-hidden shadow-lg shadow-black/10 h-[280px] border border-outline-variant/20" onPress={() => router.push('/employee/trip-details' as any)}>
            <Image
                source={image}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
            />
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
                style={StyleSheet.absoluteFillObject}
            />
            <View className="flex-1 justify-end p-6 z-10 w-full">
                <View className="flex-row justify-between items-start mb-4">
                    <View>
                        <Text className="font-headline font-bold text-xl text-white mb-1">
                            {title}
                        </Text>
                        <Text className="font-label text-sm text-white/80">
                            {location}
                        </Text>
                    </View>
                    <View className="w-8 h-8 rounded-lg bg-white/20 items-center justify-center backdrop-blur-md">
                        <MaterialIcons name="flight-takeoff" size={16} color="white" />
                    </View>
                </View>

                <View className="gap-3">
                    <View className="flex-row justify-between items-end">
                        <Text className="text-[10px] font-label uppercase tracking-widest text-white/80 font-bold">
                            Budget Status
                        </Text>
                        <Text className="text-sm font-headline font-bold text-white">
                            {currency}{spent.toFixed(2)} / {currency}{budget.toFixed(2)}
                        </Text>
                    </View>
                    <View className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <View className="h-full bg-primary-fixed-dim rounded-full" style={{ width: '56.8%' }} />
                    </View>

                    <View className="flex-row justify-between items-center pt-2">
                        <Text className="text-[10px] font-label text-white/70 font-bold">
                            {startDate} - {endDate}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ActiveTripCard