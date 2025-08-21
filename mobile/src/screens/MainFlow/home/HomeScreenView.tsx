import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../helpers/styles';

type RecentUser = {
    id: string;
    name: string;
    avatar: string;
    online?: boolean;
};

type Conversation = {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timeLabel: string;
    online?: boolean;
    isMine?: boolean;
    messageStatus?: 'sent' | 'delivered' | 'read';
    unreadCount?: number;
    isTyping?: boolean;
};

type HomeScreenViewProps = {
    onOpenConversation?: (conversationId: string) => void;
    onStartChatWithUser?: (userId: string) => void;
    onOpenProfile?: () => void;
    currentUserInitial?: string;
    recentUsers?: RecentUser[];
    conversations?: Conversation[];
    isLoading?: boolean;
};

const defaultRecentUsers: RecentUser[] = [
    { id: '1', name: 'Barry', avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', name: 'Perez', avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: '3', name: 'Alvin', avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: '4', name: 'Dan', avatar: 'https://i.pravatar.cc/100?img=4' },
    { id: '5', name: 'Fran', avatar: 'https://i.pravatar.cc/100?img=5' }
];

const defaultConversations: Conversation[] = [
    {
        id: 'c1',
        name: 'Danny Hopkins',
        avatar: 'https://i.pravatar.cc/100?img=11',
        lastMessage: 'dannylove@gmail.com',
        timeLabel: '08:43'
    },
    {
        id: 'c2',
        name: 'Bobby Langford',
        avatar: 'https://i.pravatar.cc/100?img=12',
        lastMessage: 'Will do, super, thank you 🙂❤️',
        timeLabel: 'Tue'
    },
    {
        id: 'c3',
        name: 'William Wiles',
        avatar: 'https://i.pravatar.cc/100?img=13',
        lastMessage: 'Uploaded file.',
        timeLabel: 'Sun'
    },
    {
        id: 'c4',
        name: 'James Edelen',
        avatar: 'https://i.pravatar.cc/100?img=14',
        lastMessage: 'Here is another tutorial, if you...',
        timeLabel: '23 Mar'
    },
    {
        id: 'c5',
        name: 'Jose Farmer',
        avatar: 'https://i.pravatar.cc/100?img=15',
        lastMessage: '😄',
        timeLabel: '18 Mar'
    },
    {
        id: 'c6',
        name: 'Frank Marten',
        avatar: 'https://i.pravatar.cc/100?img=16',
        lastMessage: 'no pracujemy z domu przez 5 ...',
        timeLabel: '01 Feb'
    },
    {
        id: 'c7',
        name: 'Marzena Klasa',
        avatar: 'https://i.pravatar.cc/100?img=17',
        lastMessage: 'potem sie zobaczy',
        timeLabel: '01 Feb'
    }
];

export const HomeScreenView = ({
    onOpenConversation,
    onStartChatWithUser,
    onOpenProfile,
    currentUserInitial,
    recentUsers,
    conversations,
    isLoading
}: HomeScreenViewProps) => {
    const recent = useMemo(() => recentUsers ?? defaultRecentUsers, [recentUsers]);
    const chats = useMemo(() => conversations ?? defaultConversations, [conversations]);
    const getInitial = (name?: string) => (name?.trim()?.charAt(0)?.toUpperCase() || '?');

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Messages</Text>
                    <TouchableOpacity accessibilityRole="button" onPress={onOpenProfile} style={styles.avatarBtn}>
                        <Text style={styles.avatarText}>{(currentUserInitial || '?').toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <View style={styles.loaderWrap}>
                        <ActivityIndicator size="small" color={colors.white} />
                    </View>
                ) : null}

                <Text style={styles.sectionHint}>RECENT</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recentStrip}
                    style={styles.recentScroll}
                >
                    {recent.map(user => (
                        <TouchableOpacity key={user.id} onPress={() => onStartChatWithUser && onStartChatWithUser(user.id)} style={styles.recentItem}>
                            <View style={styles.recentAvatarCircle}>
                                <View style={[styles.dot, { backgroundColor: user.online ? '#32CD32' : '#808080' }]} />
                                <Text style={styles.recentAvatarText}>{getInitial(user.name)}</Text>
                            </View>
                            <Text numberOfLines={1} style={styles.recentName}>{user.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.listCard}>
                    <FlatList
                        data={chats}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        style={styles.list}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => onOpenConversation && onOpenConversation(item.id)} style={styles.row}>
                                <View style={styles.avatarCircle}>
                                    <View style={[styles.dot, { backgroundColor: item.online ? '#32CD32' : '#808080' }]} />
                                    <Text style={styles.listAvatarText}>{getInitial(item.name)}</Text>
                                </View>
                                <View style={styles.rowMiddle}>
                                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                                    {item.isTyping ? (
                                        <Text style={[styles.lastMessage, { fontStyle: 'italic', color: colors.lightgreen }]}>typing…</Text>
                                    ) : (
                                        <Text style={styles.lastMessage} numberOfLines={1}>
                                            {item.isMine ? (
                                                <Text style={[styles.tick, item.messageStatus === 'read' ? styles.tickRead : undefined]}>
                                                    {(item.messageStatus === 'delivered' || item.messageStatus === 'read') ? '✓✓' : '✓'}
                                                </Text>
                                            ) : null}
                                            {item.isMine ? ' ' : ''}{item.lastMessage}
                                        </Text>
                                    )}
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={styles.timeLabel}>{item.timeLabel}</Text>
                                    {item.unreadCount ? (
                                        <View style={styles.unreadBadge}>
                                            <Text style={styles.unreadText}>{item.unreadCount}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const AVATAR_SIZE = 44;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.darkblue
    },
    container: {
        flex: 1,
        paddingTop: 6
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    title: {
        color: colors.white,
        fontSize: 28,
        fontWeight: '800',
        marginLeft: 10
    },
    avatarBtn: {
        height: 36,
        width: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.gray,
        marginRight: 10
    },
    avatarText: {
        color: colors.white,
        fontWeight: '800',
    },
    sectionHint: {
        color: colors.white,
        opacity: 0.6,
        letterSpacing: 1.5,
        fontSize: 12,
        marginTop: 4, 
        marginLeft: 10
    },
    recentStrip: {
        paddingTop: 8,
        paddingBottom: 4
    },
    recentScroll: {
        marginBottom: 0
    },
    recentItem: {
        width: 60,
        marginRight: 12,
        alignItems: 'center'
    },
    recentAvatarCircle: {
        height: 52,
        width: 52,
        borderRadius: 26,
        marginBottom: 4,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        position: 'absolute',
        right: 2,
        bottom: 2,
        height: 10,
        width: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: colors.gray
    },
    recentAvatarText: {
        color: colors.white,
        fontWeight: '800',
        fontSize: 18
    },
    recentName: {
        color: colors.white,
        fontSize: 12
    },
    listCard: {
        height: '80%',
        backgroundColor: colors.gray,
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 6,
        
    },
    list: {
        flex: 1
    },
    loaderWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8
    },
    listContent: {
        paddingVertical: 4
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8
    },
    avatarCircle: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        marginRight: 12,
        backgroundColor: colors.darkblue,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listAvatarText: {
        color: colors.white,
        fontWeight: '800',
        fontSize: 16
    },
    rowMiddle: {
        flex: 1
    },
    name: {
        color: colors.white,
        fontWeight: '700',
        marginBottom: 2
    },
    lastMessage: {
        color: colors.white,
        opacity: 0.8
    },
    tick: {
        color: colors.white,
        opacity: 0.6,
        fontSize: 12
    },
    tickRead: {
        color: '#00BFFF',
        opacity: 1
    },
    timeLabel: {
        color: colors.white,
        opacity: 0.7
    },
    unreadBadge: {
        marginTop: 6,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        borderRadius: 9,
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },
    unreadText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '800'
    },
    separator: {
        height: 1,
        backgroundColor: '#3a4154',
        marginLeft: AVATAR_SIZE + 12
    }
});

export default HomeScreenView;


