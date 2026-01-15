import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { saveLanguage, getLanguageDisplayName } from '../services/i18n';
import { SUPPORTED_LANGUAGES } from '../constants/config';

interface LanguageSelectorProps {
    visible: boolean;
    onClose: () => void;
    currentLanguage: string;
}

export function LanguageSelector({
    visible,
    onClose,
    currentLanguage,
}: LanguageSelectorProps) {
    const { t, i18n } = useTranslation();

    const handleSelectLanguage = async (language: string) => {
        await saveLanguage(language);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{t('common.language')}</Text>

                    <FlatList
                        data={SUPPORTED_LANGUAGES}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Pressable
                                style={[
                                    styles.languageItem,
                                    item === currentLanguage && styles.languageItemSelected,
                                ]}
                                onPress={() => handleSelectLanguage(item)}
                            >
                                <Text
                                    style={[
                                        styles.languageText,
                                        item === currentLanguage && styles.languageTextSelected,
                                    ]}
                                >
                                    {getLanguageDisplayName(item)}
                                </Text>
                                {item === currentLanguage && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </Pressable>
                        )}
                    />

                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#1E1E1E', // Dark grey similar to other cards
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        maxHeight: '60%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: 'rgba(255,255,255,0.05)', // Transparent white
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    languageItemSelected: {
        backgroundColor: 'rgba(108, 92, 231, 0.2)', // Primary color opacity
        borderColor: '#6C4AB6',
    },
    languageText: {
        fontSize: 18,
        color: '#CCCCCC',
    },
    languageTextSelected: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    checkmark: {
        fontSize: 20,
        color: '#6C4AB6', // Primary color
        fontWeight: '700',
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: '#6C4AB6', // Primary color for action
        borderRadius: 16,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
