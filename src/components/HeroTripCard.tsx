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
}

const HeroTripCard = ({ image, title, location, dateStart, dateEnd }: HeroTripProps) => {
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
            </View>
        </View>
    )
}

export default HeroTripCard