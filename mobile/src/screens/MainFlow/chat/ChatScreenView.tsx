import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../helpers/styles';

type Message = {
    id: string;
    text?: string;
    timeLabel?: string; // e.g. "08:12"
    side: 'left' | 'right';
    isEmoji?: boolean; // small circular emoji bubble
    isMeta?: boolean; // centered meta like date/time separator
    status?: 'sent' | 'delivered' | 'read';
};

type ChatScreenViewProps = {
    participantName: string;
    participantAvatarUri: string;
    messages: Message[];
    onOpenSearch?: () => void;
    onBack?: () => void;
    onOpenAttachment?: () => void;
    onSend?: (text: string) => void;
    onTypingStart?: () => void;
    onTypingStop?: () => void;
    isOtherTyping?: boolean;
    isOtherOnline?: boolean;
    isLoading?: boolean;
};

const bubbleLeft = '#3a4154';
const bubbleRight = '#56607a';
const inputBg = '#343A4A';

export const ChatScreenView = ({
    participantName,
    participantAvatarUri,
    messages,
    onOpenSearch,
    onOpenAttachment,
    onSend,
    onTypingStart,
    onTypingStop,
    isOtherTyping,
    isOtherOnline,
    isLoading
}: ChatScreenViewProps) => {
    const [text, setText] = useState('');
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const data = useMemo(() => messages ?? [], [messages]);
    const headerInitial = useMemo(() => (participantName?.trim()?.charAt(0)?.toUpperCase() || '?'), [participantName]);

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend && onSend(trimmed);
        setText('');
        if (onTypingStop) onTypingStop();
    };

    const handleChange = (val: string) => {
        setText(val);
        if (!onTypingStart || !onTypingStop) return;
        onTypingStart();
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            onTypingStop();
        }, 1200);
    };

    const renderItem = ({ item }: { item: Message }) => {
        if (item.isMeta) {
            return (
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{item.text}</Text>
                </View>
            );
        }

        if (item.isEmoji) {
            return (
                <View style={[styles.emojiWrap, item.side === 'right' ? styles.alignRight : styles.alignLeft]}>
                    <View style={styles.emojiBubble}>
                        <Text style={styles.emojiText}>{item.text}</Text>
                    </View>
                </View>
            );
        }

        const isRight = item.side === 'right';
        return (
            <View style={[styles.messageRow, isRight ? styles.alignRight : styles.alignLeft]}>
                <View style={[styles.bubble, isRight ? styles.bubbleRight : styles.bubbleLeft]}>
                    {!!item.text && <Text style={styles.bubbleText}>{item.text}</Text>}
                </View>
                {!!item.timeLabel && (
                    <View style={[styles.inlineMetaRow, isRight ? styles.timeRight : styles.timeLeft]}>
                        <Text style={styles.inlineTime}>{item.timeLabel}</Text>
                        {isRight ? (
                            <Text style={[styles.tick, item.status === 'read' ? styles.tickRead : undefined]}>
                                {item.status === 'delivered' || item.status === 'read' ? '✓✓' : '✓'}
                            </Text>
                        ) : null}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView style={styles.safe} behavior={Platform.select({ ios: 'padding', android: undefined })}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.headerAvatarCircle}>
                            <Text style={styles.headerAvatarText}>{headerInitial}</Text>
                            <View style={[styles.headerDot, { backgroundColor: isOtherOnline ? '#32CD32' : '#808080' }]} />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>{participantName}</Text>
                            {isOtherTyping ? <Text style={styles.typingText}>typing…</Text> : null}
                        </View>
                    </View>
                    {/* <TouchableOpacity onPress={onOpenSearch} style={styles.searchBtn}>
                        <Text style={styles.searchIcon}>⌕</Text>
                    </TouchableOpacity> */}
                </View>

                {isLoading ? (
                    <View style={styles.loaderWrap}><ActivityIndicator size="small" color={colors.white} /></View>
                ) : null}

                <FlatList
                    data={data}
                    keyExtractor={(it) => it.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.inputBar}>
                    {/* <TouchableOpacity onPress={onOpenAttachment} style={styles.actionBtn}>
                        <Text style={styles.actionIcon}>📷</Text>
                    </TouchableOpacity> */}
                    <TextInput
                        placeholder="Message"
                        placeholderTextColor={'#B3B8C6'}
                        style={styles.textInput}
                        value={text}
                        onChangeText={handleChange}
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                        <Text style={styles.sendIcon}>➤</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.darkblue
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 6,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#3a4154'
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerAvatar: {
        height: 28,
        width: 28,
        borderRadius: 14,
        marginRight: 10
    },
    headerAvatarCircle: {
        height: 40,
        width: 40,
        borderRadius: 24,
        marginRight: 10,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerAvatarText: {
        color: colors.white,
        fontWeight: '800'
    },
    headerDot: {
        position: 'absolute',
        right: 6,
        bottom: 0,
        height: 8,
        width: 8,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.darkblue
    },
    headerTitle: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700'
    },
    typingText: {
        color: colors.white,
        opacity: 0.7,
        fontSize: 12,
        marginTop: 2
    },
    searchBtn: {
        height: 32,
        width: 32,
        borderRadius: 16,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchIcon: {
        color: colors.white,
        fontSize: 16
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 14
    },
    metaRow: {
        alignItems: 'center',
        marginVertical: 10
    },
    metaText: {
        color: colors.white,
        opacity: 0.7,
        fontSize: 12
    },
    messageRow: {
        marginVertical: 6,
        maxWidth: '85%'
    },
    alignLeft: {
        alignSelf: 'flex-start'
    },
    alignRight: {
        alignSelf: 'flex-end'
    },
    bubble: {
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 14
    },
    bubbleLeft: {
        backgroundColor: bubbleLeft,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 14,
        borderBottomRightRadius: 14
    },
    bubbleRight: {
        backgroundColor: bubbleRight,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14
    },
    bubbleText: {
        color: colors.white
    },
    inlineTime: {
        color: colors.white,
        opacity: 0.6,
        fontSize: 11,
        marginTop: 6
    },
    inlineMetaRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tick: {
        color: colors.white,
        opacity: 0.6,
        fontSize: 11,
        marginLeft: 6
    },
    tickRead: {
        color: '#00BFFF',
        opacity: 1
    },
    timeLeft: {
        alignSelf: 'flex-start'
    },
    timeRight: {
        alignSelf: 'flex-end'
    },
    emojiWrap: {
        marginVertical: 4
    },
    emojiBubble: {
        backgroundColor: '#737b90',
        height: 36,
        width: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emojiText: {
        fontSize: 18
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    actionBtn: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8
    },
    actionIcon: {
        color: colors.white,
        fontSize: 16
    },
    textInput: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        backgroundColor: inputBg,
        paddingHorizontal: 16,
        color: colors.white
    },
    sendBtn: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8
    },
    sendIcon: {
        color: colors.white
    },
    loaderWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8
    }
});

export default ChatScreenView;


