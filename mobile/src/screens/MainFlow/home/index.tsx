import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import HomeScreenView from './HomeScreenView';
import { chatApi } from '../../../api/chat';
import { AuthContext } from '../../../context/AuthContext';
import { connectSocket } from '../../../api/socket';


type Props = {
    navigation: any;
};

const HomeScreen = ({ navigation }: Props) => {
    const { token, user } = useContext(AuthContext);
    const [users, setUsers] = useState<any[]>([]);
    const [conversations, setConversations] = useState<any[]>([]);
    const socketRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [typingUserIds, setTypingUserIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [userList, convs] = await Promise.all([
                    chatApi.listUsers(),
                    chatApi.listConversations()
                ]);
                if (mounted) {
                    setUsers(userList);
                    setConversations(convs);
                }
            } catch {}
            finally {
                if (mounted) setIsLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [token]);

    useEffect(() => {
        if (!token) return;
        const socket = connectSocket(token);
        socketRef.current = socket;
        socket.on('presence:update', ({ userId, online }: any) => {
            setUsers((prev) => prev.map((u: any) => u._id === userId ? { ...u, status: online ? 'online' : 'offline' } : u));
        });
        socket.on('typing:start', ({ from }: any) => {
            setTypingUserIds((prev) => {
                const next = new Set(prev);
                if (from) next.add(from);
                return next;
            });
        });
        socket.on('typing:stop', ({ from }: any) => {
            setTypingUserIds((prev) => {
                const next = new Set(prev);
                if (from) next.delete(from);
                return next;
            });
        });
        socket.on('message:new', (payload: any) => {
            setConversations((prev) => {
                const idx = prev.findIndex((c: any) => c._id === payload.conversation);
                if (idx === -1) return prev;
                const next = prev.slice();
                const isToMe = payload.receiver === user?._id;
                const unread = (next[idx].unreadCount || 0) + (isToMe ? 1 : 0);
                next[idx] = { ...next[idx], lastMessage: { _id: payload._id, content: payload.content, sender: payload.sender, receiver: payload.receiver, status: payload.status, createdAt: payload.createdAt }, unreadCount: unread };
                return next;
            });
        });
        socket.on('message:delivered', ({ messageId }: any) => {
            setConversations((prev) => prev.map((c: any) => c.lastMessage && c.lastMessage._id === messageId ? { ...c, lastMessage: { ...c.lastMessage, status: 'delivered' } } : c));
        });
        socket.on('message:read', ({ conversationId }: any) => {
            setConversations((prev) => prev.map((c: any) => c._id === conversationId ? { ...c, lastMessage: c.lastMessage ? { ...c.lastMessage, status: 'read' } : c.lastMessage, unreadCount: 0 } : c));
        });
        return () => {
            socket.off('presence:update');
            socket.off('message:new');
            socket.off('message:delivered');
            socket.off('message:read');
            socket.off('typing:start');
            socket.off('typing:stop');
        };
    }, [token]);

    // Map all users except current user into list rows with last message and status
    const allUsersList = useMemo(() => {
        return users
            .filter((u: any) => u._id !== user?._id)
            .map((u: any) => {
                const conv = conversations.find((c: any) => (c.participants || []).some((p: any) => p._id === u._id));
                const lm = (conv?.unreadCount ? conv?.lastUnreadMessage : conv?.lastMessage) || conv?.lastMessage;
                const isMine = lm ? lm.sender === user?._id : false;
                return {
                    id: u._id,
                    name: u.name,
                    avatar: 'https://i.pravatar.cc/100',
                    lastMessage: lm ? lm.content : '',
                    timeLabel: lm ? new Date(lm.createdAt).toLocaleTimeString() : '',
                    online: (u.status || '').toLowerCase() === 'online',
                    isMine,
                    messageStatus: lm ? lm.status : undefined,
                    unreadCount: conv?.unreadCount || 0,
                    isTyping: typingUserIds.has(u._id)
                };
            });
    }, [users, user?._id, conversations, typingUserIds]);

    const currentUserInitial = (user?.name || user?.email || '?').trim().charAt(0);

    const navigateToChatWith = async (selectedUserId: string) => {
        try {
            const { _id } = await chatApi.getOrCreateWith(selectedUserId);
            const selectedUser = users.find((u: any) => u._id === selectedUserId);
            navigation?.navigate?.('Chat', {
                conversationId: _id,
                participantName: selectedUser?.name || '',
                participantAvatarUri: 'https://i.pravatar.cc/100'
            });
        } catch {}
    };

    return (
        <HomeScreenView
            // Tapping a list item (user) should create/open 1:1 conversation
            onOpenConversation={navigateToChatWith}
            // Recent strip also opens a chat
            onStartChatWithUser={navigateToChatWith}
            onOpenProfile={() => navigation?.navigate?.('Profile')}
            currentUserInitial={currentUserInitial}
            // Provide the full user list (except self) for the main list
            conversations={allUsersList}
            recentUsers={allUsersList.slice(0, 10)}
            isLoading={isLoading}
        />
    );
};

export default HomeScreen;


