import EmployeeImage from "@/assets/images/employee.png";
import AppLogo from "@/assets/images/logo.png";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

type TopNavigatorProps = {
    mode: 'employee' | 'auditor'
}

const TopNavigator = ({ mode }: TopNavigatorProps) => {
    const { userProfile } = useAuth();
    
    return (
        <View className="flex-row justify-between items-center w-full px-6 py-4 bg-surface z-40">
            <View className="flex-row items-center gap-1">
                <View className="w-10 h-10 rounded-[14px] items-center justify-center overflow-hidden shadow-sm relative">
                    <Image
                        source={AppLogo}
                        style={StyleSheet.absoluteFillObject}
                        contentFit="cover"
                    />
                </View>
                <Text className="font-headline font-bold text-3xl tracking-tighter text-primary">
                    Macrosoft
                </Text>
                <Text className="text-on-surface-variant text-xs font-light tracking-widest opacity-70">
                    {mode}
                </Text>
            </View>
            <TouchableOpacity className="p-2 rounded-full active:bg-surface-container opacity-80 transition-opacity">
                <View className="w-10 h-10 rounded-[14px] bg-primary-container items-center justify-center overflow-hidden shadow-sm relative">
                    <Image
                        source={userProfile?.logo ? { uri: userProfile.logo } : EmployeeImage}
                        style={StyleSheet.absoluteFillObject}
                        contentFit="cover"
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default TopNavigator