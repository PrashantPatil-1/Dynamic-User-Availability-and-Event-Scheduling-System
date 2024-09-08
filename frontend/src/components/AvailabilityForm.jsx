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

  const saveSlot = async () => {
    if (!start || !end || !duration) {
      alert("Please fill out all fields");
      return;
    }

    try {
      if (selectedSlot) {
        if (selectedSlot.booked) {
          alert("Call to admin for modify.");
          return;
        }
        const response = await axios.put(`http://localhost:3000/api/availability/${selectedSlot._id}`, {
          start,
          end,
          duration,
        });
        setAvailability(availability.map(slot => slot._id === selectedSlot._id ? response.data : slot));
        setSelectedSlot(null);
      } else {
        const response = await axios.post("http://localhost:3000/api/availability", {
          user: user._id,
          start,
          end,
          duration,
        });
        setAvailability([...availability, response.data]);
      }
      setStart("");
      setEnd("");
      setDuration(30);
    } catch (error) {
      console.error("Error saving slot:", error);
    }
  };

  const deleteSlot = async (slotId, booked) => {
    if (booked) {
      alert("Call to admin for modify.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/availability/${slotId}`);
      setAvailability(availability.filter(slot => slot._id !== slotId));
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };

  return (
    <div>
      <h3>Set Availability</h3>
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
        <label>Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>
      <button onClick={saveSlot}>
        {selectedSlot ? "Update Slot" : "Save Slot"}
      </button>
      <div>
        <h3>Your Availability</h3>
        <ul>
          {availability.map(slot => (
            <li key={slot._id}>
              {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleString()} ({slot.duration} minutes)
              {slot.booked ? (
                <span style={{ color: "red", marginLeft: "10px" }}>Booked</span>
              ) : (
                <span style={{ color: "green", marginLeft: "10px" }}>Available</span>
              )}
              <button onClick={() => {
                setSelectedSlot(slot);
                setStart(slot.start);
                setEnd(slot.end);
                setDuration(slot.duration);
              }}>Edit</button>
              <button onClick={() => deleteSlot(slot._id, slot.booked)} style={{ color: "red" }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AvailabilityForm;
