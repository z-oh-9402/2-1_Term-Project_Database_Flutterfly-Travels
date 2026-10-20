// Chat events from the server's socket (App.jsx owns the socket and hands it here), for the chat page and the navbar
const CHAT_EVENT = 'flutterfly:chat';

let socket = null;

export const setChatSocket = (newSocket) => {
    socket = newSocket;
}

// App.jsx passes on 'chat-message', 'chat-seen', 'chat-typing' (and 'chat-read' when this tab marks a chat read)
export const announceChat = (type, data) => {
    window.dispatchEvent(new CustomEvent(CHAT_EVENT, { detail: { type, data } }));
}

// Calls callback(type, data) for every chat event. Returns a function that stops listening.
export const onChat = (callback) => {
    const listener = (event) => callback(event.detail.type, event.detail.data);
    window.addEventListener(CHAT_EVENT, listener);
    return () => window.removeEventListener(CHAT_EVENT, listener);
}

// Tells the other person this user is typing (passed on by the server, never stored)
export const sendTyping = (toUserId) => {
    if(socket && socket.connected)
    {
        socket.emit('chat-typing', { to: toUserId });
    }
}

const OPEN_TRIP_STATUSES = ['REQUESTING', 'UPDATING', 'PENDING', 'CONFIRMED'];

// Whether to offer "Send message" for this person (the same rule as CAN_MESSAGE in the database, which has the
// final say): customers may write to anyone, agents to agents and to customers they share an unfinished trip with.
// person needs user_id and user_type.
export const canStartChat = (me, person) => {
    if(!me || !person || me.user_id === person.user_id || me.user_type === 'admin' || person.user_type === 'admin')
    {
        return false;
    }
    if(me.user_type === 'customer' || person.user_type === 'agent')
    {
        return true;
    }
    return (me.trips ?? []).some(trip => trip.customer_id === person.user_id && OPEN_TRIP_STATUSES.includes(trip.trip_status));
}
