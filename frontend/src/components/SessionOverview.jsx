// frontend/components/SessionOverview.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function SessionOverview({ userId }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/sessions/${userId}`);
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [userId]);

  return (
    <div>
      <h2>Upcoming Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.sessionId}>
            <strong>Session ID:</strong> {session.sessionId} <br />
            <strong>Participants:</strong> {session.participants.map(p => p.email).join(", ")} <br />
            <strong>Scheduled Time:</strong> {new Date(session.scheduledTime).toLocaleString()} <br />
            <strong>Duration:</strong> {session.duration} minutes <br />
            <strong>Type:</strong> {session.sessionType}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionOverview;
