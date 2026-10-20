# Flutterfly Travels: frontend

The React app of [Flutterfly Travels](../README.md), built with Vite. See the main README for setting up the database and the backend first.

## Scripts

```bash
npm install
npm run dev       # development server on http://localhost:5000
npm run build     # production build in dist/
npm run preview   # serves the production build
npm run lint      # ESLint
```

The app expects the backend on `http://localhost:3000`, for the API and for socket.io (live notifications and chat). That address is written directly in the source files, so change it there if your backend runs elsewhere.

## Structure

```
src/
  main.jsx            Entry point: router and the user context
  App.jsx             Routes, the socket connection, notification and chat counts
  api.js              apiFetch (sends the login token, logs out on 401) and photoUrl
  chat.js             Chat events and canStartChat, the client-side copy of the database's chat rule
  notifications.js    "A notification arrived" events for pages that show related data
  Context/            UserInfoContext: the logged-in user and their trips
  Pages/              Pages: home, sign-up and login, destinations, accommodations, restaurants, flights,
                      profile, chat, trips
  Components/         Shared pieces: booking popups (AddToTrip, CreateTrip), trip views (AgentTrip, AdminTasks,
                      TripBookings), the navbar, notifications, date fields, ratings, MessageHover
  Styles/             One stylesheet per area (my-trips.css, agent-trips.css, chat.css, ...)
public/               Home page photos, rating icons and the default profile picture
```
