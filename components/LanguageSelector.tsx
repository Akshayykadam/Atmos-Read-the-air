import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { saveLanguage, getLanguageDisplayName } from '../services/i18n';
import { SUPPORTED_LANGUAGES } from '../constants/config';
import { GenZTheme } from '../constants/Theme';

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
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: GenZTheme.cards.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        maxHeight: '70%',
        ...GenZTheme.cards.shadow,
    },
    title: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 18,
        color: GenZTheme.text.primary,
        marginBottom: 24,
        textAlign: 'center',
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 24,
        marginBottom: 12,
        backgroundColor: GenZTheme.background, // Subtle secondary background
    },
    languageItemSelected: {
        backgroundColor: GenZTheme.colors.primaryContainer,
    },
    languageText: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 16,
        color: GenZTheme.text.secondary,
    },
    languageTextSelected: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        color: GenZTheme.text.primary,
    },
    checkmark: {
        fontSize: 20,
        color: GenZTheme.colors.primary,
        fontWeight: '700',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 18,
        alignItems: 'center',
        backgroundColor: GenZTheme.colors.primary,
        borderRadius: 100, // Pill shaped button
        ...GenZTheme.cards.shadow,
    },
    closeButtonText: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        color: GenZTheme.colors.onPrimary,
        fontSize: 14,
    },
});
