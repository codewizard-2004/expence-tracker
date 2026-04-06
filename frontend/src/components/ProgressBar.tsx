import { Text, View } from "react-native"

const ProgressBar = ({ approved, disapproved, appealed = 0 }: { approved: number, disapproved: number, appealed?: number }) => {
    return (
        <>
        <View className="h-3 bg-surface-container-high rounded-full overflow-hidden flex-row mb-4">
            <View className="h-full bg-primary" style={{ width: `${approved}%` }} />
            <View className="h-full bg-[#FBC02D]" style={{ width: `${disapproved}%` }} />
            <View className="h-full bg-[#FE6A34]" style={{ width: `${appealed}%` }} />
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
                <View className="w-2.5 h-2.5 rounded-full bg-[#FBC02D]" />
                <View>
                    <Text className="font-body font-bold text-sm text-[#FBC02D]">
                        {disapproved}%
                    </Text>
                    <Text className="font-label text-[10px] text-on-surface-variant">
                        Disapproved
                    </Text>
                </View>
            </View>
            {appealed > 0 && (
                <View className="flex-row items-center gap-2">
                    <View className="w-2.5 h-2.5 rounded-full bg-[#FE6A34]" />
                    <View>
                        <Text className="font-body font-bold text-sm text-[#FE6A34]">
                            {appealed}%
                        </Text>
                        <Text className="font-label text-[10px] text-on-surface-variant">
                            Appealed
                        </Text>
                    </View>
                </View>
            )}
        </View>

        </>
    )
}

export default ProgressBar