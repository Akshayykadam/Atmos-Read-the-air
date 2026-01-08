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
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '60%',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: 20,
        textAlign: 'center',
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: '#F5F5F5',
    },
    languageItemSelected: {
        backgroundColor: '#E8F5E9',
    },
    languageText: {
        fontSize: 18,
        color: '#333333',
    },
    languageTextSelected: {
        color: '#2E7D32',
        fontWeight: '600',
    },
    checkmark: {
        fontSize: 20,
        color: '#2E7D32',
        fontWeight: '700',
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
