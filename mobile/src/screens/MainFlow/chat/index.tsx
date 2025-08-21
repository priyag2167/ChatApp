import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import ChatScreenView from './ChatScreenView';
import { chatApi } from '../../../api/chat';
import { AuthContext } from '../../../context/AuthContext';
import { connectSocket } from '../../../api/socket';


type Props = {
    navigation: any;
    route: { params?: { conversationId?: string; participantName?: string; participantAvatarUri?: string; messages?: any[] } };
};

const ChatScreen = ({ navigation, route }: Props) => {
    const { token, user } = useContext(AuthContext);
    const conversationId = route?.params?.conversationId ?? '';
    const [participantName, setParticipantName] = useState(route?.params?.participantName ?? '');
    const [participantAvatarUri, setParticipantAvatarUri] = useState(route?.params?.participantAvatarUri ?? '');
    const [messages, setMessages] = useState<any[]>([]);
    const socketRef = useRef<any>(null);
    const [otherUserId, setOtherUserId] = useState<string | null>(null);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const [isOtherOnline, setIsOtherOnline] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                // Ensure we know the other participant
                const convs = await chatApi.listConversations();
                const conv = convs.find((c) => c._id === conversationId);
                if (conv) {
                    const other = conv.participants.find((p) => p._id !== user?._id);
                    if (mounted) {
                        setOtherUserId(other?._id || null);
                        if (!participantName) setParticipantName(other?.name || '');
                        setIsOtherOnline((other?.status || '').toLowerCase() === 'online');
                    }
                }
                const data = await chatApi.listMessages(conversationId);
                if (!mounted) return;
                const mapped = data.map((m) => ({
                    id: m._id,
                    text: m.content,
                    side: m.sender === user?._id ? 'right' : 'left',
                    timeLabel: new Date(m.createdAt).toLocaleTimeString(),
                    status: m.status,
                }));
                setMessages(mapped);
            } catch {}
            finally {
                if (mounted) setIsLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [conversationId, user?._id]);

    useEffect(() => {
        if (!token) return;
        const socket = connectSocket(token);
        socketRef.current = socket;
        socket.on('message:new', (payload: any) => {
            if (payload.conversation !== conversationId) return;
            const isMine = payload.sender === user?._id;
            setMessages((prev) => prev.concat({
                id: payload._id,
                text: payload.content,
                side: isMine ? 'right' : 'left',
                timeLabel: new Date(payload.createdAt).toLocaleTimeString(),
                status: payload.status,
            }));
            // If message is from the other user, mark as read immediately
            if (payload.sender !== user?._id && otherUserId) {
                socket.emit('message:read', { conversationId, from: otherUserId });
            }
        });
        socket.on('typing:start', ({ from }: any) => {
            if (from === otherUserId) setIsOtherTyping(true);
        });
        socket.on('typing:stop', ({ from }: any) => {
            if (from === otherUserId) setIsOtherTyping(false);
        });
        socket.on('presence:update', ({ userId, online }: any) => {
            if (userId === otherUserId) setIsOtherOnline(!!online);
        });
        socket.on('message:delivered', ({ messageId }: any) => {
            setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, status: 'delivered' } : m));
        });
        socket.on('message:read', (payload: any) => {
            const convId = payload?.conversationId;
            if (convId !== conversationId) return;
            // If payload has count, it means this device just marked messages as read; ignore UI change here
            if (typeof payload?.count === 'number') return;
            setMessages((prev) => prev.map((m) => m.side === 'right' ? { ...m, status: 'read' } : m));
        });
        return () => {
            // Keep connection alive globally; only remove listeners from this screen
            socket.off('message:new');
            socket.off('typing:start');
            socket.off('typing:stop');
            socket.off('presence:update');
            socket.off('message:delivered');
            socket.off('message:read');
        };
    }, [token, conversationId, user?._id, otherUserId]);

    // Mark messages as read when opening the chat with the other user
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !otherUserId || !conversationId) return;
        socket.emit('message:read', { conversationId, from: otherUserId });
    }, [otherUserId, conversationId]);

    return (
        <ChatScreenView
            participantName={participantName}
            participantAvatarUri={participantAvatarUri}
            messages={messages}
            onOpenSearch={() => navigation?.navigate?.('Search')}
            onOpenAttachment={() => {}}
            onSend={(text) => {
                if (!otherUserId) return;
                socketRef.current?.emit('message:send', { to: otherUserId, content: text });
            }}
            onTypingStart={() => { if (otherUserId) socketRef.current?.emit('typing:start', { to: otherUserId }); }}
            onTypingStop={() => { if (otherUserId) socketRef.current?.emit('typing:stop', { to: otherUserId }); }}
            isOtherTyping={isOtherTyping}
            isOtherOnline={isOtherOnline}
            isLoading={isLoading}
        />
    );
};

export default ChatScreen;


