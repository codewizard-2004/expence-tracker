import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";


type HeroTripProps = {
    image: any;
    title: string;
    location: string;
    dateStart: string;
    dateEnd: string;
    budget?: number;
    expenditure?: number;
}

const HeroTripCard = ({ image, title, location, dateStart, dateEnd, budget, expenditure }: HeroTripProps) => {
    const progress = (budget && budget > 0 && expenditure !== undefined) ? Math.min(100, Math.max(0, (expenditure / budget) * 100)) : 0;
    const isOverBudget = progress > 100;
    const isNearingBudget = progress > 85;

    return (
        <View
            className="relative rounded-[24px] overflow-hidden mb-8"
            style={{ minHeight: 220 }}
        >
            <Image
                source={image}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
            />
            <BlurView
                intensity={40}
                tint="dark"
                style={StyleSheet.absoluteFillObject}
            />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
            <View className="p-6 pt-8 z-10 items-center justify-center" style={{ minHeight: 220 }}>
                <View className="flex-row items-center gap-1 mb-3">
                    <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.85)" />
                    <Text className="text-white font-label text-xs uppercase tracking-widest font-bold">
                        {location}
                    </Text>
                </View>
                <Text className="font-headline font-extrabold text-3xl text-white text-center mb-4">
                    {title}
                </Text>
                <View className="flex-row items-center gap-6">
                    <View className="flex-row items-center gap-1.5">
                        <MaterialIcons name="date-range" size={14} color="rgba(255,255,255,0.7)" />
                        <Text className="text-white/70 font-label text-xs font-medium">
                            {dateStart} - {dateEnd}
                        </Text>
                    </View>
                </View>

                {budget !== undefined && budget > 0 && expenditure !== undefined && (
                    <View className="w-full mt-6 items-center px-4">
                        <View className="h-[6px] w-[200px] rounded-full bg-white/20 overflow-hidden">
                            <View 
                                className="h-full rounded-full" 
                                style={{ 
                                    backgroundColor: isOverBudget ? '#FE6A34' : isNearingBudget ? '#FFB300' : '#14F195',
                                    width: `${Math.min(100, progress)}%` 
                                }} 
                            />
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}

export default HeroTripCard