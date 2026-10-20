import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import '../Styles/agent-trips.css';
import { useEffect, useState } from 'react';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { FaRegCalendarAlt, FaUserTie } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import TripBookings from './TripBookings';
import { bookingSummary, dateRange, errorMessage, hasNoBookings, money, tripLength } from './tripHelpers';
import { apiFetch, photoUrl } from '../api';
import { onNotification } from '../notifications';

const fullName = (first, last, username) => `${first ?? ''} ${last ?? ''}`.trim() || username;

// [agents waiting for review, trips waiting for review]
const fetchTasks = () => Promise.all([
    apiFetch(`http://localhost:3000/agent/pending-agents/`, { method: "GET" }).then(response => response.ok ? response.json() : []),
    apiFetch(`http://localhost:3000/trip/fetch-pending-trips/`, { method: "GET" }).then(response => response.ok ? response.json() : []),
]);

// An admin's work, on their profile page: travel agents who signed up, and trips sent for approval.
// Both lists reload whenever a notification arrives (a sign-up, a trip sent for approval).
const AdminTasks = () => {
    const [pendingAgents, setPendingAgents] = useState([]);
    const [pendingTrips, setPendingTrips] = useState([]);
    const [currentTab, setCurrentTab] = useState('agents');
    const [visitingTripId, setVisitingTripId] = useState(null);
    const [error, setError] = useState(null);
    const [isBusy, setIsBusy] = useState(false);

    const reload = async () => {
        const [agents, trips] = await fetchTasks();
        setPendingAgents(agents);
        setPendingTrips(trips);
    }

    useEffect(() => {
        let ignore = false;
        const load = async () => {
            const [agents, trips] = await fetchTasks();
            if(!ignore)
            {
                setPendingAgents(agents);
                setPendingTrips(trips);
            }
        };
        load();
        const stopListening = onNotification(load);
        return () => {
            ignore = true;
            stopListening();
        };
    }, []);

    // looked up again on every render, so a trip someone else already decided on simply disappears
    const visitingTrip = visitingTripId === null ? null : pendingTrips.find(trip => trip.trip_id === visitingTripId) ?? null;

    // Sends a decision, reloads both lists, and shows the server's message if it failed
    const decide = async (request, fallback) => {
        setIsBusy(true);
        setError(null);
        const response = await request();
        if(!response.ok)
        {
            setError(await errorMessage(response, fallback));
        }
        await reload();
        setIsBusy(false);
        return response.ok;
    }

    const decideOnAgent = (agent, approve) => {
        if(!approve && !window.confirm(`Decline ${agent.username}'s travel agent account?`))
        {
            return;
        }
        decide(() => apiFetch(`http://localhost:3000/agent/${approve ? 'acceptRequest' : 'declineRequest'}/${agent.user_id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(approve ? { acc_status: "OK" } : { status: "" })
        }), approve ? 'Could not approve the agent' : 'Could not decline the agent');
    }

    // approving confirms the trip; rejecting removes it (its customer and agent are told)
    const decideOnTrip = async (trip, approve) => {
        if(!approve && !window.confirm(`Reject and remove the trip "${trip.name}"?`))
        {
            return;
        }
        const done = await decide(() => apiFetch(`http://localhost:3000/trip/admin-decision/`, {
            method: approve ? "PUT" : "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripId: trip.trip_id })
        }), approve ? 'Could not approve the trip' : 'Could not reject the trip');
        if(done)
        {
            setVisitingTripId(null);
        }
    }

    // Approve / Reject (or Decline); on a card they don't open it
    const decisionButtons = (onApprove, onReject, rejectLabel) => (
        <div className='agent-trip-decision'>
            <button className='agent-btn agent-btn-accept' disabled={isBusy} onClick={(e) => { e.stopPropagation(); onApprove(); }}>
                <TiTick/> Approve
            </button>
            <button className='agent-btn agent-btn-decline' disabled={isBusy} onClick={(e) => { e.stopPropagation(); onReject(); }}>
                <RxCross2/> {rejectLabel}
            </button>
        </div>
    );

    const person = (photo, name, username, label) => (
        <p className='agent-trip-line'>
            {label && <span className='agent-trip-muted'>{label}</span>}
            <img className='agent-trip-avatar' src={photoUrl(photo)} alt=''/>
            {name} <span className='agent-trip-muted'>@{username}</span>
        </p>
    );

    const errorLine = error && <p className='trip-form-error agent-trips-error'>{error}</p>;

    if(visitingTrip !== null)
    {
        const trip = visitingTrip;
        return (
        <div className='agent-trips'>
            <button className='agent-trips-back' onClick={() => { setVisitingTripId(null); setError(null); }}><IoArrowBack/> Trips to review</button>

            <div className='agent-trip-title'>
                <h2>{trip.name}</h2>
                {decisionButtons(() => decideOnTrip(trip, true), () => decideOnTrip(trip, false), 'Reject')}
            </div>

            <div className='agent-trip-stats'>
                <div className='agent-trip-stat'>
                    <span className='agent-trip-stat-label'>Dates</span>
                    <span className='agent-trip-stat-value'>{dateRange(trip)}</span>
                    <span className='agent-trip-stat-note'>{tripLength(trip)}</span>
                </div>
                <div className='agent-trip-stat'>
                    <span className='agent-trip-stat-label'>Total cost</span>
                    <span className='agent-trip-stat-value agent-trip-cost'>{money(trip.total_cost)}</span>
                    <span className='agent-trip-stat-note'>{bookingSummary(trip) ?? 'Nothing booked'}</span>
                </div>
                <div className='agent-trip-stat'>
                    <span className='agent-trip-stat-label'>Customer</span>
                    <div className='agent-trip-person'>
                        <img src={photoUrl(trip.customer_photo)} alt=''/>
                        <div className='agent-trip-person-text'>
                            <span className='agent-trip-stat-value'>{fullName(trip.customer_first_name, trip.customer_last_name, trip.customer_name)}</span>
                            <span className='agent-trip-stat-note'>@{trip.customer_name}</span>
                            <span className='agent-trip-stat-note' title={trip.customer_email}>{trip.customer_email}</span>
                        </div>
                    </div>
                </div>
                <div className='agent-trip-stat'>
                    <span className='agent-trip-stat-label'>Agent</span>
                    {trip.agent_id ?
                    <div className='agent-trip-person'>
                        <img src={photoUrl(trip.agent_photo)} alt=''/>
                        <div className='agent-trip-person-text'>
                            <span className='agent-trip-stat-value'>{fullName(trip.agent_first_name, trip.agent_last_name, trip.agent_name)}</span>
                            <span className='agent-trip-stat-note'>@{trip.agent_name}</span>
                        </div>
                    </div> :
                    <span className='agent-trip-stat-note'>None. The customer planned this trip.</span>}
                </div>
            </div>

            {errorLine}

            <h3 className='agent-trip-section-title'>Bookings</h3>
            {hasNoBookings(trip) ?
                <div className='agent-trips-empty'><p>Nothing booked.</p></div> :
                <TripBookings trip={trip} canEdit={false} onRemove={() => {}}/>}
        </div>);
    }

    const tabs = [
        { key: 'agents', name: 'Agent sign-ups', count: pendingAgents.length },
        { key: 'trips', name: 'Trips to review', count: pendingTrips.length },
    ];

    return (
    <div className='agent-trips'>
        <h2 className='agent-trips-heading'>Pending Tasks</h2>
        <div className='agent-trips-tabs' role='tablist'>
            {tabs.map(tab =>
                <button key={tab.key} role='tab' aria-selected={currentTab === tab.key}
                        className={'agent-trips-tab' + (currentTab === tab.key ? ' selected' : '')}
                        onClick={() => { setCurrentTab(tab.key); setError(null); }}>
                    {tab.name}
                    {tab.count !== 0 && <span className='agent-trips-count'>{tab.count}</span>}
                </button>
            )}
        </div>

        {errorLine}

        {currentTab === 'agents' ?
            (pendingAgents.length === 0 ?
                <div className='agent-trips-empty'>No travel agents waiting for review.</div>
            :
            <div className='agent-trips-grid'>
                {pendingAgents.map(agent =>
                    <div key={agent.user_id} className='agent-trip-card admin-applicant'>
                        <div className='admin-applicant-top'>
                            <img className='admin-applicant-photo' src={photoUrl(agent.photo)} alt=''/>
                            <div className='agent-trip-person-text'>
                                <h3>{fullName(agent.first_name, agent.last_name, agent.username)}</h3>
                                <span className='agent-trip-muted'>@{agent.username}</span>
                            </div>
                        </div>
                        <p className='agent-trip-line'><FaUserTie/> {agent.experience_years} years of experience · {money(agent.fee)} fee</p>
                        <p className='agent-trip-line agent-trip-muted' title={agent.email}>{agent.email}</p>
                        {decisionButtons(() => decideOnAgent(agent, true), () => decideOnAgent(agent, false), 'Decline')}
                    </div>
                )}
            </div>)
        :
            (pendingTrips.length === 0 ?
                <div className='agent-trips-empty'>No trips waiting for review.</div>
            :
            <div className='agent-trips-grid'>
                {pendingTrips.map(trip =>
                    <div key={trip.trip_id} className='agent-trip-card' role='button' tabIndex={0}
                         onClick={() => { setError(null); setVisitingTripId(trip.trip_id); }}
                         onKeyDown={(e) => { if(e.target === e.currentTarget && e.key === 'Enter') setVisitingTripId(trip.trip_id); }}>
                        <div className='agent-trip-card-top'>
                            <h3>{trip.name}</h3>
                            <span className='agent-trip-cost'>{money(trip.total_cost)}</span>
                        </div>
                        <p className='agent-trip-line'>
                            <FaRegCalendarAlt/> {dateRange(trip)} <span className='agent-trip-muted'>· {tripLength(trip)}</span>
                        </p>
                        {person(trip.customer_photo, fullName(trip.customer_first_name, trip.customer_last_name, trip.customer_name), trip.customer_name, 'Customer')}
                        {trip.agent_id ?
                            person(trip.agent_photo, fullName(trip.agent_first_name, trip.agent_last_name, trip.agent_name), trip.agent_name, 'Agent') :
                            <p className='agent-trip-line'><span className='agent-trip-muted'>Agent</span> <FaUserTie/> none</p>}
                        <p className='agent-trip-bookings'>{bookingSummary(trip) ?? 'Nothing booked'}</p>
                        {decisionButtons(() => decideOnTrip(trip, true), () => decideOnTrip(trip, false), 'Reject')}
                    </div>
                )}
            </div>)}
    </div>);
};

export default AdminTasks;
