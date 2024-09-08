import React, { useState } from "react";
import axios from "axios";

function ScheduleSessionForm({ availability, sessions: initialSessions, setAvailability }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [type, setType] = useState("One-on-One");
  const [attendees, setAttendees] = useState([{ name: "", email: "" }]);
  const [notificationType, setNotificationType] = useState("Email");
  const [sessions, setSessions] = useState(initialSessions);

  const handleAttendeeChange = (index, field, value) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const addAttendee = () => {
    if (type === "One-on-One" && attendees.length === 1) {
      alert("Only one attendee is allowed for a One-on-One session.");
      return;
    }
    setAttendees([...attendees, { name: "", email: "" }]);
  };

  const scheduleSession = async () => {
    if (!selectedSlot) {
      alert("Please select an availability slot.");
      return;
    }

    if (attendees.some(attendee => !attendee.name || !attendee.email)) {
      alert("Please fill in all attendee details.");
      return;
    }

    const payload = {
      sessionId: `session-${Date.now()}`,
      participants: attendees.map(attendee => attendee.email),
      scheduledTime: new Date(selectedSlot.start).toISOString(),
      createdBy: selectedSlot.user,
      duration: selectedSlot.duration,
      sessionType: type,
      notifications: attendees.map(attendee => ({
        email: attendee.email,
        type: notificationType,
        time: new Date(selectedSlot.start).toISOString(),
      })),
    };

    try {
      const response = await axios.post("http://localhost:3000/api/sessions", payload);
      console.log("Session scheduled successfully:", response.data);
      alert("Session scheduled successfully!");
      setSessions([...sessions, response.data]); // Add new session to the list

      // Update availability slot status
      setAvailability(prev => prev.map(slot =>
        slot.start === selectedSlot.start ? { ...slot, booked: true } : slot
      ));

      // Reset attendees for the next session
      setAttendees([{ name: "", email: "" }]);
    } catch (error) {
      console.error("Error scheduling session:", error.response ? error.response.data : error.message);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:3000/api/sessions/cancel/${sessionId}`);
      alert("Session deleted successfully.");
      setSessions(sessions.filter(session => session.sessionId !== sessionId)); // Remove session from the list
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const isSlotBooked = (slot) => {
    return sessions.some(session =>
      new Date(session.scheduledTime).getTime() === new Date(slot.start).getTime() &&
      session.duration === slot.duration
    );
  };

  return (
    <div>
      <h2>Schedule a Session</h2>
      <div>
        <label>Select an Availability Slot:</label>
        <select onChange={(e) => setSelectedSlot(JSON.parse(e.target.value))} value={selectedSlot ? JSON.stringify(selectedSlot) : ""}>
          <option value="">--Select Slot--</option>
          {availability.map((slot, index) => (
            <option key={index} value={JSON.stringify(slot)} disabled={isSlotBooked(slot)}>
              {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleString()}
              {isSlotBooked(slot) && " (Already Booked)"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Session Type:</label>
        <select
          value={type}
          onChange={(e) => {
            const newType = e.target.value;
            setType(newType);
            if (newType === "One-on-One" && attendees.length > 1) {
              setAttendees(attendees.slice(0, 1));
            }
          }}
        >
          <option value="One-on-One">One-on-One</option>
          <option value="Group">Group</option>
        </select>
      </div>
      <div>
        <label>Notification Type:</label>
        <select value={notificationType} onChange={(e) => setNotificationType(e.target.value)}>
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
        </select>
      </div>
      <div>
        <h3>Attendees</h3>
        {attendees.map((attendee, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Name"
              value={attendee.name}
              onChange={(e) => handleAttendeeChange(index, "name", e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={attendee.email}
              onChange={(e) => handleAttendeeChange(index, "email", e.target.value)}
            />
          </div>
        ))}
        {type === "Group" && <button onClick={addAttendee}>Add Attendee</button>}
      </div>
      <button onClick={scheduleSession}>Schedule Session</button>

      <h2>Scheduled Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions scheduled.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Session Type</th>
              <th>Participants</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.sessionId}>
                <td>{new Date(session.scheduledTime).toLocaleDateString()}</td>
                <td>{new Date(session.scheduledTime).toLocaleTimeString()}</td>
                <td>{session.sessionType}</td>
                <td>{session.participants.join(', ')}</td>
                <td>
                  <button onClick={() => deleteSession(session.sessionId)} style={{ color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ScheduleSessionForm;
