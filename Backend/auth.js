require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set. Add it to Backend/.env (see Backend/.env.example).');
}

const signToken = (user) => {
    return jwt.sign({ id: user.user_id, role: user.user_type }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// { id, role } of the user a token belongs to, or null if the token is missing, invalid or expired
const verifyToken = (token) => {
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return { id: payload.id, role: payload.role };
    }
    catch (error) {
        return null;
    }
}

// Rejects the request unless it carries a valid "Authorization: Bearer <token>" header.
// On success, req.user = { id, role } of the logged-in user.
const requireAuth = (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');

    if (scheme !== 'Bearer' || !token) {
        res.status(401).json({ message: "Login required" });
        return;
    }

    const user = verifyToken(token);
    if (!user) {
        res.status(401).json({ message: "Session expired or invalid, please log in again" });
        return;
    }

    req.user = user;
    next();
}

// Use after requireAuth.
const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: "Not allowed" });
        return;
    }
    next();
}

// Use after requireAuth. The user id named in the request must be the logged-in user's own id (admins may act on anyone).
const requireSelfOrAdmin = (getUserId) => (req, res, next) => {
    if (req.user.role !== 'admin' && String(getUserId(req)) !== String(req.user.id)) {
        res.status(403).json({ message: "Not allowed" });
        return;
    }
    next();
}

// True if the logged-in user (req.user) is the trip's customer, its assigned agent, or an admin
const canAccessTrip = async (user, tripId) => {
    if (user.role === 'admin') {
        return true;
    }
    const database = require('./database');
    const rows = await database.query(`SELECT CUSTOMER_ID, AGENT_ID FROM TRIP WHERE TRIP_ID=$1`, [tripId]);
    return rows.length !== 0 && (rows[0].customer_id === user.id || rows[0].agent_id === user.id);
}

// Who may add or remove a trip's bookings, and when: the trip's customer while it is being put together
// (REQUESTING, before an agent accepts it, or UPDATING), the trip's agent once they have accepted it (UPDATING),
// and an admin at any time. Returns null when allowed, otherwise [HTTP status, message].
const bookingEditProblem = async (user, tripId) => {
    const database = require('./database');
    const rows = await database.query(`SELECT CUSTOMER_ID, AGENT_ID, TRIP_STATUS FROM TRIP WHERE TRIP_ID=$1`, [tripId]);
    if (rows.length === 0) {
        return [404, "Trip not found"];
    }
    if (user.role === 'admin') {
        return null;
    }
    const trip = rows[0];
    if (trip.customer_id === user.id) {
        return ['REQUESTING', 'UPDATING'].includes(trip.trip_status) ? null
            : [409, "Bookings can only be changed until the trip is sent for approval"];
    }
    if (trip.agent_id === user.id) {
        return trip.trip_status === 'UPDATING' ? null
            : [409, "Bookings can only be changed after you accept the trip, until it is sent for approval"];
    }
    return [403, "Not allowed"];
}

exports.signToken = signToken;
exports.bookingEditProblem = bookingEditProblem;
exports.verifyToken = verifyToken;
exports.canAccessTrip = canAccessTrip;
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.requireSelfOrAdmin = requireSelfOrAdmin;
