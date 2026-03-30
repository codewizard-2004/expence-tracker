import { Text, View } from "react-native"

const UserMessage = ({ msg }: { msg: any }) => {
    return (
        <View key={msg.id} className="items-end">
            <View
                className="max-w-[85%] bg-primary px-5 py-3 shadow-sm"
                style={{
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 4,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                }}
            >
                <Text className="text-sm font-body text-white">
                    {msg.text}
                </Text>
            </View>
            <Text className="mt-1 text-[10px] font-label text-outline uppercase tracking-wider">
                {msg.time}
            </Text>
        </View>
    )
}

export default UserMessage