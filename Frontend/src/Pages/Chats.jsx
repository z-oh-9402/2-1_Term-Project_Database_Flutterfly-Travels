import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsChatDots, BsImage, BsSendFill } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';
import { FaSearch } from 'react-icons/fa';
import UserInfoContext from '../Context/UserInfoContext';
import { apiFetch, photoUrl } from '../api';
import { onChat, sendTyping } from '../chat';
import { errorMessage, formatTime } from '../Components/tripHelpers';
import MessageHover from '../Components/MessageHover';
import '../Styles/chat.css';

const TYPING_SHOWN_MS = 3500;
const TYPING_SENT_EVERY_MS = 2000;

const displayName = (person) => `${person.first_name ?? ''} ${person.last_name ?? ''}`.trim() || person.username;
const roleName = (person) => person.user_type === 'agent' ? 'Travel agent' : 'Customer';

const sameDay = (a, b) => a.toDateString() === b.toDateString();

// "Today", "Yesterday" or "Oct 19, 2026", for the line between days in a conversation
const dayLabel = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if(sameDay(date, today)) return 'Today';
    if(sameDay(date, yesterday)) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// the time of a conversation's last message in the list: "9:30 AM" today, "Oct 19" before
const listTime = (value) => {
    const date = new Date(value);
    return sameDay(date, new Date()) ? formatTime(date) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Messages between customers and agents: the user's conversations on the left (or people found by the search),
// the open one (/chats/:username) on the right. Everything arrives live through the socket (see chat.js).
const Chats = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useContext(UserInfoContext);
    const me = userInfo.user_id;

    const [conversations, setConversations] = useState(null);
    const [search, setSearch] = useState('');
    const [people, setPeople] = useState([]);
    // { user, canSend, conversationId, messages } for the open conversation
    const [chat, setChat] = useState(null);
    const [chatError, setChatError] = useState(null);
    const [draft, setDraft] = useState('');
    // { file, url } of the photo about to be sent
    const [photo, setPhoto] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState(null);
    const [otherTyping, setOtherTyping] = useState(false);

    const chatRef = useRef(null);
    chatRef.current = chat;
    const messagesRef = useRef(null);
    // older messages: one request at a time, and where the list was scrolled when they arrived
    const isLoadingOlder = useRef(false);
    const keepScroll = useRef(null);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const fileRef = useRef(null);
    const lastTypingSent = useRef(0);
    const typingTimer = useRef(null);

    const loadConversations = async () => {
        const response = await apiFetch(`http://localhost:3000/chat/conversations`, { method: 'GET' });
        if(response.ok)
        {
            setConversations(await response.json());
        }
    }

    const markSeen = (name) => apiFetch(`http://localhost:3000/chat/with/${encodeURIComponent(name)}/seen`, { method: 'PUT' });

    // the conversation in the address bar
    useEffect(() => {
        setChat(null);
        setChatError(null);
        setDraft('');
        setPhoto(null);
        setSendError(null);
        setOtherTyping(false);
        if(!username)
        {
            return;
        }
        let ignore = false;
        (async () => {
            const response = await apiFetch(`http://localhost:3000/chat/with/${encodeURIComponent(username)}`, { method: 'GET' });
            if(ignore)
            {
                return;
            }
            if(!response.ok)
            {
                setChatError(await errorMessage(response, 'Could not open this conversation'));
                return;
            }
            const found = await response.json();
            setChat(found);
            if(found.messages.some(message => message.sender_id !== me && !message.seen_at))
            {
                await markSeen(username);
                loadConversations();
            }
        })();
        return () => { ignore = true; };
    }, [username, me]);

    // live updates
    useEffect(() => {
        loadConversations();
        const stopListening = onChat((type, data) => {
            const current = chatRef.current;
            if(type === 'message')
            {
                const inOpenChat = current && (data.conversation_id === current.conversationId
                    || (current.conversationId === null && data.sender_id === current.user.user_id));
                if(inOpenChat)
                {
                    setChat(previous => previous && ({
                        ...previous,
                        conversationId: data.conversation_id,
                        messages: previous.messages.some(message => message.message_id === data.message_id)
                            ? previous.messages : [...previous.messages, data],
                    }));
                    if(data.sender_id !== me)
                    {
                        setOtherTyping(false);
                        markSeen(current.user.username);
                    }
                }
                loadConversations();
            }
            else if(type === 'seen')
            {
                if(current && data.conversationId === current.conversationId && data.by !== me)
                {
                    const now = new Date().toISOString();
                    setChat(previous => previous && ({
                        ...previous,
                        messages: previous.messages.map(message =>
                            message.sender_id === me && !message.seen_at && message.message_id <= data.upTo ? { ...message, seen_at: now } : message),
                    }));
                }
                loadConversations();
            }
            else if(type === 'typing')
            {
                if(current && data.from === current.user.user_id)
                {
                    setOtherTyping(true);
                    clearTimeout(typingTimer.current);
                    typingTimer.current = setTimeout(() => setOtherTyping(false), TYPING_SHOWN_MS);
                }
            }
            else if(type === 'resync')
            {
                loadConversations();
            }
        });
        return () => {
            stopListening();
            clearTimeout(typingTimer.current);
        };
    }, [me]);

    // people search, a moment after the user stops typing
    useEffect(() => {
        const query = search.trim();
        if(query === '')
        {
            setPeople([]);
            return;
        }
        let ignore = false;
        const timer = setTimeout(async () => {
            const response = await apiFetch(`http://localhost:3000/chat/people?q=${encodeURIComponent(query)}`, { method: 'GET' });
            if(!ignore && response.ok)
            {
                setPeople(await response.json());
            }
        }, 250);
        return () => { ignore = true; clearTimeout(timer); };
    }, [search]);

    // The list is anchored to its bottom (column-reverse in chat.css): it opens on the newest message, and its scrollTop
    // counts up from the bottom (0 there, negative above), so older messages added at the top don't move what's shown.
    // A new message (sent or received) brings the view back down to it.
    const lastMessageId = chat?.messages.length ? chat.messages[chat.messages.length - 1].message_id : null;
    useEffect(() => {
        if(messagesRef.current)
        {
            messagesRef.current.scrollTop = 0;
        }
    }, [lastMessageId, otherTyping, chat?.user?.user_id]);

    // Older messages, when the user scrolls near the top
    const loadOlder = async () => {
        const current = chatRef.current;
        if(!current || !current.hasMore || isLoadingOlder.current || current.messages.length === 0)
        {
            return;
        }
        isLoadingOlder.current = true;
        setLoadingOlder(true);
        const oldest = current.messages[0].message_id;
        const response = await apiFetch(`http://localhost:3000/chat/with/${encodeURIComponent(current.user.username)}?before=${oldest}`, { method: 'GET' });
        if(response.ok && chatRef.current && chatRef.current.user.user_id === current.user.user_id)
        {
            const page = await response.json();
            keepScroll.current = messagesRef.current?.scrollTop ?? null;
            setChat(previous => previous && ({
                ...previous,
                hasMore: page.hasMore,
                messages: [...page.messages.filter(message => !previous.messages.some(shown => shown.message_id === message.message_id)), ...previous.messages],
            }));
        }
        isLoadingOlder.current = false;
        setLoadingOlder(false);
    }

    // the browser keeps a list scrolled to its very top pinned there when older messages are added above, which would
    // show them (and load the next page) at once; scrollTop counts from the bottom here, so putting it back keeps
    // the messages the user was reading in place
    useLayoutEffect(() => {
        if(keepScroll.current !== null && messagesRef.current)
        {
            messagesRef.current.scrollTop = keepScroll.current;
        }
        keepScroll.current = null;
    }, [chat?.messages]);

    const handleMessagesScroll = (e) => {
        const list = e.currentTarget;
        const fromTop = list.scrollHeight - list.clientHeight - Math.abs(list.scrollTop);
        if(fromTop < 120)
        {
            loadOlder();
        }
    }

    const openChat = (person) => {
        setSearch('');
        navigate(`/chats/${encodeURIComponent(person.username)}`);
    }

    const handleDraftChange = (e) => {
        setDraft(e.target.value);
        const now = Date.now();
        if(chat && now - lastTypingSent.current > TYPING_SENT_EVERY_MS)
        {
            lastTypingSent.current = now;
            sendTyping(chat.user.user_id);
        }
    }

    const choosePhoto = (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        if(file && file.type.startsWith('image/'))
        {
            setPhoto({ file, url: URL.createObjectURL(file) });
        }
    }

    // the preview's object URL is released once the photo is sent, removed or replaced
    useEffect(() => () => { if(photo) URL.revokeObjectURL(photo.url); }, [photo]);

    const send = async () => {
        if(!chat || isSending || (draft.trim() === '' && !photo))
        {
            return;
        }
        setIsSending(true);
        setSendError(null);
        const body = new FormData();
        body.append('content', draft);
        if(photo)
        {
            body.append('file', photo.file);
        }
        const response = await apiFetch(`http://localhost:3000/chat/with/${encodeURIComponent(chat.user.username)}`, { method: 'POST', body });
        setIsSending(false);
        if(!response.ok)
        {
            setSendError(await errorMessage(response, 'Could not send the message'));
            return;
        }
        const message = await response.json();
        setChat(previous => previous && ({
            ...previous,
            conversationId: message.conversation_id,
            messages: previous.messages.some(existing => existing.message_id === message.message_id)
                ? previous.messages : [...previous.messages, message],
        }));
        setDraft('');
        setPhoto(null);
        loadConversations();
    }

    // Enter sends, Shift+Enter starts a new line
    const handleKeyDown = (e) => {
        if(e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault();
            send();
        }
    }

    const preview = (conversation) => {
        const text = conversation.last_content ?? (conversation.last_image ? 'Photo' : '');
        return (conversation.last_sender_id === me ? 'You: ' : '') + text;
    }

    const lastMineSeen = chat ? [...chat.messages].reverse().find(message => message.sender_id === me) : null;

    const readOnlyNote = (person) => userInfo.user_type === 'agent' && person.user_type === 'customer'
        ? `Your trips with ${displayName(person)} are over, so you can't send new messages. You can still read this conversation, and they can write to you.`
        : `You can't send messages to ${displayName(person)}.`;

    return (
    <div className='chat-page'>
        <aside className='chat-sidebar'>
            <h2>Messages</h2>
            <label className='chat-search'>
                <FaSearch/>
                <input type='text' value={search} placeholder='Search people by name or username' onChange={(e) => setSearch(e.target.value)}/>
                {search && <button className='chat-search-clear' aria-label='Clear the search' onClick={() => setSearch('')}><RxCross2/></button>}
            </label>

            <div className='chat-list'>
                {search.trim() !== '' ?
                    (people.length === 0 ?
                        <p className='chat-list-empty'>Nobody you can message matches &ldquo;{search.trim()}&rdquo;.</p>
                    :
                    people.map(person =>
                        <button key={person.user_id} className='chat-list-item' onClick={() => openChat(person)}>
                            <img src={photoUrl(person.photo)} alt=''/>
                            <span className='chat-list-text'>
                                <span className='chat-list-name'>{displayName(person)}</span>
                                <span className='chat-list-preview'>@{person.username} · {roleName(person)}</span>
                            </span>
                        </button>
                    ))
                : conversations === null ?
                    <p className='chat-list-empty'>Loading...</p>
                : conversations.length === 0 ?
                    <p className='chat-list-empty'>No conversations yet. Search for someone to start one.</p>
                :
                conversations.map(conversation =>
                    <button key={conversation.conversation_id}
                            className={'chat-list-item' + (conversation.username === username ? ' selected' : '') + (conversation.unread > 0 ? ' unread' : '')}
                            onClick={() => openChat(conversation)}>
                        <img src={photoUrl(conversation.photo)} alt=''/>
                        <span className='chat-list-text'>
                            <span className='chat-list-top'>
                                <span className='chat-list-name'>{displayName(conversation)}</span>
                                <span className='chat-list-time'>{listTime(conversation.last_message_at)}</span>
                            </span>
                            <span className='chat-list-bottom'>
                                <span className='chat-list-preview'>{preview(conversation)}</span>
                                {conversation.unread > 0 && <span className='chat-unread'>{conversation.unread}</span>}
                            </span>
                        </span>
                    </button>
                )}
            </div>
        </aside>

        <section className='chat-main'>
            {!username ?
                <div className='chat-placeholder'>
                    <BsChatDots/>
                    <p>Choose a conversation, or search for someone to message.</p>
                </div>
            : chatError ?
                <div className='chat-placeholder'><p>{chatError}</p></div>
            : chat === null ?
                <div className='chat-placeholder'><p>Loading...</p></div>
            :
            <>
                <header className='chat-header'>
                    <img src={photoUrl(chat.user.photo)} alt=''/>
                    <div>
                        {/* an agent's name opens their profile; "Send message" is left out, this is the chat */}
                        <div className='chat-header-name'>
                            <MessageHover person={chat.user} showMessage={false}><span className='person-link-name'>{displayName(chat.user)}</span></MessageHover>
                        </div>
                        <div className='chat-header-sub'>
                            {otherTyping ? <span className='chat-typing'>typing…</span> : <>@{chat.user.username} · {roleName(chat.user)}</>}
                        </div>
                    </div>
                </header>

                <div className='chat-messages' ref={messagesRef} onScroll={handleMessagesScroll}>
                    <div className='chat-messages-inner'>
                    {chat.messages.length === 0 &&
                        <p className='chat-messages-empty'>Say hello to {displayName(chat.user)}.</p>}
                    {chat.messages.length !== 0 &&
                        <p className='chat-history-edge'>
                            {chat.hasMore ? (loadingOlder ? 'Loading older messages…' : 'Scroll up for older messages') : 'This is the start of your conversation.'}
                        </p>}
                    {chat.messages.map((message, index) => {
                        const at = new Date(message.created_at);
                        const previous = chat.messages[index - 1];
                        const newDay = !previous || !sameDay(new Date(previous.created_at), at);
                        const mine = message.sender_id === me;
                        return (
                            <div key={message.message_id}>
                                {newDay && <div className='chat-day'><span>{dayLabel(at)}</span></div>}
                                <div className={'chat-bubble-row' + (mine ? ' mine' : '')}>
                                    <div className='chat-bubble'>
                                        {message.image &&
                                            <a href={message.image} target='_blank' rel='noreferrer'><img src={message.image} alt='Photo'/></a>}
                                        {message.content && <p>{message.content}</p>}
                                        <span className='chat-bubble-time'>{formatTime(at)}</span>
                                    </div>
                                </div>
                                {mine && message === lastMineSeen && message.seen_at && <div className='chat-seen'>Seen</div>}
                            </div>
                        );
                    })}
                    {otherTyping && <div className='chat-bubble-row'><div className='chat-bubble chat-bubble-typing'><span/><span/><span/></div></div>}
                    </div>
                </div>

                {chat.canSend ?
                <div className='chat-composer'>
                    {photo &&
                        <div className='chat-photo-chip'>
                            <img src={photo.url} alt=''/>
                            <span>{photo.file.name}</span>
                            <button aria-label='Remove the photo' onClick={() => setPhoto(null)}><RxCross2/></button>
                        </div>}
                    {sendError && <p className='chat-send-error'>{sendError}</p>}
                    {isSending && <p className='chat-sending'>{photo ? 'Sending the photo…' : 'Sending…'}</p>}
                    <div className='chat-composer-row'>
                        <button className='chat-icon-btn' title='Attach a photo' onClick={() => fileRef.current.click()}><BsImage/></button>
                        <input ref={fileRef} type='file' accept='image/*' hidden onChange={choosePhoto}/>
                        <textarea rows={1} value={draft} placeholder={`Message ${displayName(chat.user)}`} maxLength={4000}
                                  onChange={handleDraftChange} onKeyDown={handleKeyDown}/>
                        <button className='chat-send-btn' title='Send' disabled={isSending || (draft.trim() === '' && !photo)} onClick={send}>
                            <BsSendFill/>
                        </button>
                    </div>
                </div>
                :
                <p className='chat-read-only'>{readOnlyNote(chat.user)}</p>}
            </>}
        </section>
    </div>);
};

export default Chats;
