import { Text, View } from "react-native"

const ProgressBar = ({ approved, disapproved }: { approved: number, disapproved: number }) => {
    return (
        <>
            <View className="h-3 bg-surface-container-high rounded-full overflow-hidden flex-row mb-4">
                <View className="h-full bg-primary rounded-full" style={{ width: `${approved}%` }} />
                <View className="h-full bg-secondary" style={{ width: `${disapproved}%` }} />
            </View>

            <View className="flex-row justify-between">
                <View className="flex-row items-center gap-2">
                    <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <View>
                        <Text className="font-body font-bold text-sm text-on-surface">
                            {approved}%
                        </Text>
                        <Text className="font-label text-[10px] text-on-surface-variant">
                            Approved
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    <View className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <View>
                        <Text className="font-body font-bold text-sm text-secondary">
                            {disapproved}%
                        </Text>
                        <Text className="font-label text-[10px] text-on-surface-variant">
                            Disapproved
                        </Text>
                    </View>
                </View>
            </View>

        </>
    )
}

export default ProgressBar