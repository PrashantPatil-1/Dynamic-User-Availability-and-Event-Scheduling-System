import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  const loginUser = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        { email }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

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

  const saveAvailability = async () => {
    if (!date || !startTime || !endTime) {
      alert("Please select a date, start time, and end time before saving.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/availability",
        {
          user: user._id,
          start: `${date.toISOString().split("T")[0]}T${startTime}:00`,
          end: `${date.toISOString().split("T")[0]}T${endTime}:00`,
          duration: calculateDuration(startTime, endTime),
        }
      );
      setAvailability((prev) => [...prev, response.data]);
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  const updateAvailability = async (slotId, booked) => {
    if (booked) {
      alert("You can not update any booked slot, Call to admin for any changes.");
      return;
    }

    if (!date || !startTime || !endTime) {
      alert("Please select a date, start time, and end time before updating.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/availability/${slotId}`,
        {
          start: `${date.toISOString().split("T")[0]}T${startTime}:00`,
          end: `${date.toISOString().split("T")[0]}T${endTime}:00`,
          duration: calculateDuration(startTime, endTime),
        }
      );
      setAvailability((prev) =>
        prev.map((slot) => (slot._id === slotId ? response.data : slot))
      );
      setStartTime("");
      setEndTime("");
      setSelectedSlot(null);
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const deleteAvailability = async (slotId, booked) => {
    if (booked) {
      alert("You can not delete any booked slot, Call to admin for any changes.");
      return;       
    }

    try {
      await axios.delete(`http://localhost:3000/api/availability/${slotId}`);
      setAvailability((prev) => prev.filter((slot) => slot._id !== slotId));
    } catch (error) {
      console.error("Error deleting availability:", error);
    }
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    return Math.round((endTime - startTime) / 60000); 
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>Availability Scheduler</h1>
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            onBlur={(e) => loginUser(e.target.value)}
          />
        </div>
        {user && (
          <div>
            <h2>Set Availability</h2>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="date">Select Date:</label>
              <input
                type="date"
                id="date"
                value={date.toISOString().split("T")[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            {selectedSlot ? (
              <button onClick={() => updateAvailability(selectedSlot._id, selectedSlot.booked)}>Update Slot</button>
            ) : (
              <button onClick={saveAvailability}>Save Availability</button>
            )}
          </div>
        )}
      </div>
      {user && (
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <h2>Your Available Slots</h2>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {availability.map((slot) => (
              <li
                key={slot._id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {new Date(slot.start).toLocaleString()} -{" "}
                  {new Date(slot.end).toLocaleString()} ({slot.duration} minutes)
                </span>
                <span>
                  {slot.booked ? (
                    <span style={{ color: "red", marginLeft: "10px" }}>Booked</span>
                  ) : (
                    <span style={{ color: "green", marginLeft: "10px" }}>Available</span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStartTime(slot.start.split("T")[1].slice(0, 5));
                      setEndTime(slot.end.split("T")[1].slice(0, 5));
                    }}
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      background: "orange",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAvailability(slot._id, slot.booked)}
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      background: "red",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
