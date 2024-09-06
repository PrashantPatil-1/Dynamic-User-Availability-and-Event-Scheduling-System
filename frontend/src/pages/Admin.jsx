import React, { useEffect, useState } from "react";
import axios from "axios";
import ScheduleSessionForm from "../components/ScheduleSessionForm";

function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const fetchAvailability = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/availability/${userId}`);
      setAvailability(response.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/sessions/${userId}`);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (event) => {
    const userIndex = event.target.value;
    const user = users[userIndex];
    setSelectedUser(user);
    fetchAvailability(user._id);
    fetchSessions(user._id); // Fetch sessions for the selected user
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <select
        className="form-select"
        onChange={handleUserChange}
        value={users.findIndex(user => user._id === selectedUser?._id) || ""}
      >
        <option value="">Select User</option>
        {users.map((user, index) => (
          <option key={user._id} value={index}>
            {user.email}
          </option>
        ))}
      </select>
      {selectedUser && (
        <>
          <button
            className="btn btn-primary mt-3"
            onClick={() => fetchAvailability(selectedUser._id)}
            disabled={loading}
          >
            {loading ? "Loading..." : "View Availability"}
          </button>
          <h2>Availability for {selectedUser.email}</h2>
          <div>
            {availability.length === 0 ? (
              <p>No availability slots found.</p>
            ) : (
              <ScheduleSessionForm
                availability={availability}
                sessions={sessions} // Pass the sessions to the ScheduleSessionForm
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;
