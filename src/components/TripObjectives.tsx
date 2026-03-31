import { Text, View } from "react-native";

type TripObjectivesProps = {
    purpose: string
    OBJECTIVES: {
        title: string;
        description: string;
        color: string;
    }[];
}

const TripObjectives = ({ OBJECTIVES, purpose }: TripObjectivesProps) => {
    return (
        <>
            <View className="mb-8">
                <View className="flex-row items-center gap-2 mb-4">
                    <Text className="text-on-surface font-headline font-bold text-lg">
                        ✈️ Trip Purpose
                    </Text>
                </View>
                <Text className="text-on-surface-variant font-body text-sm leading-relaxed">
                    {purpose}
                </Text>
            </View>
            <View className="mb-8">
                <Text className="text-on-surface font-headline font-bold text-lg mb-4">
                    Key Objectives
                </Text>
                <View className="gap-3">
                    {OBJECTIVES.map((obj, index) => (
                        <View
                            key={index}
                            className="flex-row items-start gap-4 bg-surface-container-low rounded-2xl p-4"
                        >
                            <View
                                className="w-1 self-stretch rounded-full mt-0.5"
                                style={{ backgroundColor: obj.color }}
                            />
                            <View className="flex-1">
                                <Text className="font-body font-bold text-sm text-on-surface mb-1">
                                    {obj.title}
                                </Text>
                                <Text className="font-body text-xs text-on-surface-variant">
                                    {obj.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </>
    )

}

export default TripObjectives