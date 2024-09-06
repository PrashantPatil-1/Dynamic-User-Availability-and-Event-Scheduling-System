import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  const loginUser = async (email) => {
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", { email });
      setUser(response.data);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/availability/${user._id}`);
      setAvailability(response.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const saveAvailability = async () => {
    if (!date || !startTime || !endTime) {
      alert("Please select a date, start time, and end time before saving.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/availability", {
        user: user._id,
        start: `${date.toISOString().split('T')[0]}T${startTime}:00`,
        end: `${date.toISOString().split('T')[0]}T${endTime}:00`,
        duration: calculateDuration(startTime, endTime),
      });
      setAvailability(prev => [...prev, response.data]);
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    return Math.round((endTime - startTime) / 60000); // Duration in minutes
  };

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px', textAlign: 'center' }}>
      <h1>Availability Scheduler</h1>
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            onBlur={(e) => loginUser(e.target.value)}
          />
        </div>
        {user && (
          <div>
            <h2>Set Availability</h2>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="date">Select Date:</label>
              <input
                type="date"
                id="date"
                value={date.toISOString().split('T')[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <button onClick={saveAvailability} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
              Save Availability
            </button>
            <div style={{ marginTop: '20px' }}>
              <h3>Existing Availability</h3>
              <ul>
                {availability && availability.length > 0 ? (
                  availability.map((slot, index) => (
                    <li key={index}>
                      {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleString()} ({slot.duration} minutes)
                      {slot.booked ? (
                        <span style={{ color: 'red', marginLeft: '10px' }}>Booked for session</span>
                      ) : (
                        <span style={{ color: 'green', marginLeft: '10px' }}>Available</span>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No availability slots available.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
