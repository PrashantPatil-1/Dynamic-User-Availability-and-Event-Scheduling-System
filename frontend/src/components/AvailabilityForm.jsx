import React, { useState, useEffect } from "react";
import axios from "axios";

function AvailabilityForm({ user }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [duration, setDuration] = useState(30);
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/availability/${user._id}`);
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
      const response = await axios.post("http://localhost:3000/api/availability", {
        user: user._id,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        duration,
      });
      setAvailability(prev => [...prev, response.data]);
      setStart("");
      setEnd("");
      setDuration(30);
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  const updateAvailability = async (slotId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/availability/${slotId}`, {
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        duration,
      });
      setAvailability(prev =>
        prev.map(slot => slot._id === slotId ? response.data : slot)
      );
      setStart("");
      setEnd("");
      setDuration(30);
      setSelectedSlot(null);
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const deleteAvailability = async (slotId) => {
    try {
      await axios.delete(`http://localhost:3000/api/availability/${slotId}`);
      setAvailability(prev => prev.filter(slot => slot._id !== slotId));
    } catch (error) {
      console.error("Error deleting availability:", error);
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
      <button onClick={selectedSlot ? () => updateAvailability(selectedSlot._id) : saveAvailability}>
        {selectedSlot ? "Update Availability" : "Save Availability"}
      </button>
      <div>
        <h3>Existing Availability</h3>
        <ul>
          {availability.map((slot, index) => (
            <li key={index}>
              {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleString()} ({slot.duration} minutes)
              <button onClick={() => { setSelectedSlot(slot); setStart(new Date(slot.start).toISOString().split('T')[0]); setEnd(new Date(slot.end).toISOString().split('T')[0]); }} style={{ marginLeft: '10px' }}>Edit</button>
              <button onClick={() => deleteAvailability(slot._id)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AvailabilityForm;
