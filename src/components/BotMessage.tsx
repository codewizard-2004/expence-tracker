import { Text, View } from "react-native";

const renderBotText = (text: string) => {
    // Simple bold parsing for **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <Text key={i} className="font-semibold text-primary">
                    {part.slice(2, -2)}
                </Text>
            );
        }
        return <Text key={i}>{part}</Text>;
    });
};

const BotMessage = ({ msg }: { msg: any }) => {
    return (
        <View key={msg.id} className="items-start">
            <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-[10px] font-label text-primary font-bold uppercase tracking-widest">
                    Macrosoft Policy Bot
                </Text>
            </View>
            <View
                className="max-w-[85%] bg-surface-container px-5 py-4 shadow-sm border border-outline-variant/15"
                style={{
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                }}
            >
                <Text className="text-sm font-body text-on-surface leading-relaxed mb-3">
                    {renderBotText(msg.text)}
                </Text>
            </View>
            <Text className="mt-1 text-[10px] font-label text-outline uppercase tracking-wider">
                {msg.time}
            </Text>
        </View>
    )
}

export default BotMessage