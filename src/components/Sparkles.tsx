import { MaterialIcons } from '@expo/vector-icons';
import { View } from "react-native";

const Sparkles = () => {
    return (
        <View className="absolute inset-0 pointer-events-none overflow-hidden">
            <View className="absolute top-12 -right-4 rotate-12">
                <MaterialIcons name="auto-awesome" size={120} color="#e8dfee" />
            </View>
            <View className="absolute bottom-12 -left-4 -rotate-12">
                <MaterialIcons name="auto-awesome" size={100} color="#e8dfee" />
            </View>
        </View>
    )
}

export default Sparkles