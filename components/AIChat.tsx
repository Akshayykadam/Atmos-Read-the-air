import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Pressable,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AQIData } from '../services/aqiApi';
import { getAIResponse, PROMPT_KEYS, AIError } from '../services/geminiApi';

interface AIChatProps {
    aqiData: AQIData;
}

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    isCached?: boolean;
}

export function AIChat({ aqiData }: AIChatProps) {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const quickPrompts = [
        { key: PROMPT_KEYS.WHY_HIGH, text: t('chat.quickPrompts.whyHigh') },
        { key: PROMPT_KEYS.PRECAUTIONS, text: t('chat.quickPrompts.precautions') },
        { key: PROMPT_KEYS.OUTDOOR_SAFE, text: t('chat.quickPrompts.outdoorSafe') },
        { key: PROMPT_KEYS.MASK_NEEDED, text: t('chat.quickPrompts.maskNeeded') },
    ];

    const sendMessage = async (text: string, promptKey?: string) => {
        if (!text.trim()) return;

        setError(null);
        setInputText('');

        const userMessage: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            isUser: true,
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await getAIResponse(
                aqiData,
                text.trim(),
                i18n.language,
                promptKey
            );

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                isUser: false,
                isCached: response.isCached,
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            const aiError = err as AIError;
            if (aiError.type === 'quota') {
                setError(t('chat.quotaExceeded'));
            } else {
                setError(t('chat.error'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Messages */}
            <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                {messages.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>{t('chat.title')}</Text>
                        <Text style={styles.emptySubtitle}>{t('chat.disclaimer')}</Text>
                    </View>
                )}

                {messages.map((message) => (
                    <View
                        key={message.id}
                        style={[
                            styles.messageBubble,
                            message.isUser ? styles.userBubble : styles.aiBubble,
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,
                                message.isUser ? styles.userText : styles.aiText,
                            ]}
                        >
                            {message.text}
                        </Text>
                        {message.isCached && (
                            <Text style={styles.cachedLabel}>({t('common.cached')})</Text>
                        )}
                    </View>
                ))}

                {isLoading && (
                    <View style={[styles.messageBubble, styles.aiBubble]}>
                        <ActivityIndicator size="small" color="#1a1a2e" />
                        <Text style={styles.thinkingText}>{t('chat.thinking')}</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Quick Prompts */}
            {messages.length === 0 && (
                <FlatList
                    horizontal
                    data={quickPrompts}
                    keyExtractor={(item) => item.key}
                    style={styles.quickPrompts}
                    contentContainerStyle={styles.quickPromptsContent}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.quickPromptButton}
                            onPress={() => sendMessage(item.text, item.key)}
                        >
                            <Text style={styles.quickPromptText}>{item.text}</Text>
                        </Pressable>
                    )}
                />
            )}

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder={t('chat.placeholder')}
                    placeholderTextColor="#999"
                    multiline
                    maxLength={500}
                />
                <Pressable
                    style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                    onPress={() => sendMessage(inputText)}
                    disabled={!inputText.trim() || isLoading}
                >
                    <Text style={styles.sendButtonText}>{t('chat.send')}</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 14,
        borderRadius: 16,
        marginBottom: 12,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#1a1a2e',
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: '#FFFFFF',
    },
    aiText: {
        color: '#333333',
    },
    cachedLabel: {
        fontSize: 11,
        color: '#999',
        marginLeft: 8,
    },
    thinkingText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    errorText: {
        color: '#C62828',
        fontSize: 14,
    },
    quickPrompts: {
        maxHeight: 50,
        marginBottom: 8,
    },
    quickPromptsContent: {
        paddingHorizontal: 16,
    },
    quickPromptButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    quickPromptText: {
        color: '#1a1a2e',
        fontSize: 13,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#333',
    },
    sendButton: {
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        marginLeft: 10,
    },
    sendButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
});
