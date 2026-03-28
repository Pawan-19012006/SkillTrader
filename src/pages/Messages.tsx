import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    Send, 
    MessageSquare, 
    Search as SearchIcon,
    ArrowLeft,
    CheckCheck,
    Paperclip,
    Smile
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Messages = () => {
    const { user, loading: authLoading } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const activeChatId = searchParams.get('chatId');
    
    const [chats, setChats] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeChatUser, setActiveChatUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Fetch: Active Chats
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        // Using local sorting to avoid requiring a composite index
        const chatsQuery = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', user.uid)
        );

        const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
            const fetchChatData = async () => {
                try {
                    if (snapshot.empty) {
                        setChats([]);
                        setLoading(false);
                        return;
                    }

                    const chatsData = await Promise.all(snapshot.docs.map(async (chatDoc) => {
                        const data = chatDoc.data();
                        const otherUserId = data.participants.find((id: string) => id !== user.uid);
                        
                        // Fetch other user's basic info for the list
                        const otherUserSnap = await getDoc(doc(db, 'users', otherUserId));
                        const otherUserData = otherUserSnap.exists() ? otherUserSnap.data() : { name: 'User', photoURL: '' };

                        return {
                            id: chatDoc.id,
                            ...data,
                            otherUser: {
                                uid: otherUserId,
                                name: otherUserData.displayName || otherUserData.name || 'User',
                                avatar: otherUserData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`
                            }
                        };
                    }));
                    // Sort locally
                    chatsData.sort((a: any, b: any) => {
                        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
                        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
                        return timeB - timeA;
                    });
                    setChats(chatsData);
                } catch (error) {
                    console.error("Chat loading error:", error);
                } finally {
                    setLoading(false);
                }
            };
            
            fetchChatData();
        }, (error) => {
            console.error("Firestore onSnapshot error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Fetch Messages for Active Chat
    useEffect(() => {
        if (!activeChatId || !user) {
            setMessages([]);
            setActiveChatUser(null);
            return;
        }

        const msgsQuery = query(
            collection(db, `chats/${activeChatId}/messages`),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(msgsQuery, (snapshot) => {
            const msgsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgsData);
            
            // Auto-scroll
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        // Set Active Chat User
        const chat = chats.find(c => c.id === activeChatId);
        if (chat) {
            setActiveChatUser(chat.otherUser);
        } else {
            // Fetch if not in current chats list (e.g. direct link)
            const otherUserId = activeChatId.split('_').find(id => id !== user.uid);
            if (otherUserId) {
                getDoc(doc(db, 'users', otherUserId)).then(snap => {
                    if (snap.exists()) {
                        const data = snap.data();
                        setActiveChatUser({
                            uid: otherUserId,
                            name: data.displayName || data.name || 'User',
                            avatar: data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`
                        });
                    }
                });
            }
        }

        return () => unsubscribe();
    }, [activeChatId, user, chats]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !activeChatId || !newMessage.trim()) return;

        const text = newMessage.trim();
        setNewMessage('');

        try {
            // Add message to subcollection
            await addDoc(collection(db, `chats/${activeChatId}/messages`), {
                senderId: user.uid,
                text,
                createdAt: serverTimestamp()
            });

            // Update parent doc for list ordering & last message snapshot
            await updateDoc(doc(db, 'chats', activeChatId), {
                lastMessage: text,
                updatedAt: serverTimestamp()
            });

            await addDoc(collection(db, 'notifications'), {
                userId: activeChatUser.uid,
                title: 'New Message',
                message: text.substring(0, 50),
                type: 'chat',
                chatId: activeChatId,
                createdAt: serverTimestamp()
            }).catch(() => {}); // Optional notification logic
            
            // Note: In real app, update chatDoc.updatedAt too
        } catch (error) {
            console.error("Message send error:", error);
        }
    };

    if (!user) return null;

    return (
        <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
            <AnimatedBackground />
            <Navbar />

            <main className="flex-grow pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full flex gap-6 pb-6 h-[calc(100vh-2rem)] overflow-hidden">
                {/* Chat List Column */}
                <aside className={cn(
                    "w-full md:w-80 flex flex-col gap-4 transition-all duration-300",
                    activeChatId ? "hidden md:flex" : "flex"
                )}>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tighter">Messages</h2>
                        <span className="bg-indigo-600/20 text-indigo-500 text-[9px] font-bold px-2 py-0.5 border border-indigo-500/20 uppercase">Chatting</span>
                    </div>

                    <div className="flex-grow bg-zinc-950 border border-zinc-900 rounded-none overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-zinc-900 bg-zinc-900/10">
                            <div className="relative">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                <input 
                                    type="text"
                                    placeholder="Search messages..."
                                    className="w-full bg-zinc-950 border border-zinc-900 px-12 py-3 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto no-scrollbar">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                </div>
                            ) : chats.length === 0 ? (
                                <div className="py-20 text-center px-6">
                                    <MessageSquare className="mx-auto text-zinc-900 mb-4" size={32} />
                                    <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest leading-relaxed">
                                        No active conversations.<br/>
                                        <span className="text-zinc-800">Start a conversation from profile or sessions.</span>
                                    </p>
                                </div>
                            ) : (
                                chats.map((chat) => {
                                    const isUnread = false; // Placeholder for unread status
                                    return (
                                        <button
                                            key={chat.id}
                                            onClick={() => navigate(`/messages?chatId=${chat.id}`)}
                                            className={cn(
                                                "w-full flex items-center gap-4 p-4 transition-all hover:bg-zinc-900/80 relative group border-b border-zinc-900/50",
                                                activeChatId === chat.id ? "bg-zinc-900" : ""
                                            )}
                                        >
                                            <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden relative">
                                                <img src={chat.otherUser.avatar} className="w-full h-full object-cover" alt="" />
                                                {/* Online indicator could go here */}
                                            </div>
                                            <div className="flex-grow text-left overflow-hidden flex flex-col justify-center">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-bold text-white tracking-tight truncate">{chat.otherUser.name}</span>
                                                    <span className={cn(
                                                        "text-[10px] font-bold uppercase",
                                                        isUnread ? "text-indigo-400" : "text-zinc-600"
                                                    )}>
                                                        {chat.updatedAt?.toDate ? new Date(chat.updatedAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <p className={cn(
                                                        "text-xs truncate font-medium",
                                                        isUnread ? "text-white" : "text-zinc-500"
                                                    )}>
                                                        {chat.lastMessage || '...'}
                                                    </p>
                                                    {isUnread && (
                                                        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </aside>

                {/* Chat Window Column */}
                <section className={cn(
                    "flex-grow flex flex-col bg-zinc-950 border border-zinc-900 relative transition-all duration-300",
                    !activeChatId ? "hidden md:flex" : "flex"
                )}>
                    {activeChatId && activeChatUser ? (
                        <>
                            {/* Chat Header */}
                            <header className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950 z-10">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => navigate('/messages')} className="md:hidden text-zinc-500 hover:text-white">
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                        <img src={activeChatUser.avatar} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white tracking-tight">{activeChatUser.name}</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <GlowButton variant="glass" size="sm" className="h-8 px-4 text-[8px] font-black uppercase tracking-widest" onClick={() => navigate(`/profile/${activeChatUser.uid}`)}>
                                        View Profile
                                    </GlowButton>
                                </div>
                            </header>

                            {/* Chat Messages */}
                            <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.03)_0%,transparent_100%)]">
                                {messages.map((msg) => {
                                    const isMe = msg.senderId === user.uid;
                                    return (
                                        <motion.div 
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={cn(
                                                "flex w-full",
                                                isMe ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[80%] flex flex-col gap-1",
                                                isMe ? "items-end" : "items-start"
                                            )}>
                                                <div className={cn(
                                                    "px-4 py-2.5 text-sm font-medium relative rounded-2xl shadow-sm inline-block break-words max-w-full",
                                                    isMe 
                                                        ? "bg-indigo-600 text-white rounded-br-sm shadow-indigo-500/10" 
                                                        : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-sm"
                                                )}>
                                                    <span className="whitespace-pre-wrap">{msg.text}</span>
                                                    <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                                                        <span className="text-[9px] font-bold tracking-widest">
                                                            {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                                        </span>
                                                        {isMe && <CheckCheck size={12} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>

                            {/* Chat Input */}
                            <footer className="p-4 bg-zinc-950 relative z-10">
                                <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                                    <div className="flex-grow bg-zinc-900 border border-zinc-800 rounded-3xl flex items-end p-1.5 transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50">
                                        <button type="button" className="p-2.5 text-zinc-500 hover:text-white transition-colors">
                                            <Paperclip size={20} />
                                        </button>
                                        <textarea 
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e as any);
                                                }
                                            }}
                                            placeholder="Type a message..." 
                                            className="flex-grow bg-transparent border-none py-2.5 px-2 text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none resize-none max-h-32 min-h-10 leading-relaxed overflow-y-auto no-scrollbar"
                                            rows={1}
                                        />
                                        <button type="button" className="p-2.5 text-zinc-500 hover:text-white transition-colors">
                                            <Smile size={20} />
                                        </button>
                                    </div>
                                    <GlowButton 
                                        type="submit"
                                        variant="purple" 
                                        className="h-12 w-12 rounded-full p-0 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20"
                                        disabled={!newMessage.trim()}
                                    >
                                        <Send size={18} className="text-white ml-0.5" />
                                    </GlowButton>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.02)_0%,transparent_100%)]">
                            <div className="max-w-md space-y-6">
                                <div className="w-20 h-20 bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center mx-auto">
                                    <MessageSquare size={32} className="text-zinc-800" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tighter">Messages</h3>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                                        Select a conversation to start messaging. 
                                        Your private chats will appear here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Messages;
