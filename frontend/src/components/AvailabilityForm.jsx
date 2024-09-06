import React, { useState, useEffect } from "react";
import axios from "axios";

function AvailabilityForm({ user }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [duration, setDuration] = useState(30);
  const [availability, setAvailability] = useState([]);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/availability/${user._id}`
      );
      setAvailability(response.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  const saveAvailability = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/availability",
        {
          user: user._id,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          duration,
        }
      );
      setAvailability((prev) => {
        const updatedAvailability = prev.filter(
          (slot) => slot.start !== response.data.start
        );
        return [...updatedAvailability, response.data];
      });
      setStart("");
      setEnd("");
      setDuration(30);
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  return (
    <div>
      <h2>Set Availability for {user.email}</h2>
      <div>
        <label>Start Time:</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>
      <div>
        <label>End Time:</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>
      <div>
        <label>Duration (in minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="5"
        />
      </div>
      <button onClick={saveAvailability}>Save Availability</button>
      <div>
        <h3>Existing Availability</h3>
        <ul>
          {availability.map((slot, index) => (
            <li key={index}>
              {new Date(slot.start).toLocaleString()} -{" "}
              {new Date(slot.end).toLocaleString()} ({slot.duration} minutes)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AvailabilityForm;
