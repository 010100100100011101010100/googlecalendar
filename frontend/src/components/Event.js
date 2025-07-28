import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EventForm() {
  const [event, setEvent] = useState("Do Gym");
  const [start, setStart] = useState("");
  const [period, setPeriod] = useState("daily");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    let formattedStart = start;
    if (start && start.length === 16) {
      formattedStart = `${start}:00`;
    }

    const recurrence = [`RRULE:FREQ=${period.toUpperCase()}`];

    try {
      await axios.post(
        "http://localhost:3000/create-event",
        {
          description: event,
          startTime: formattedStart,
          recurrence,
        },
        { withCredentials: true }
      );

      navigate("/success");
    } catch (err) {
      console.error("Event creation failed:", err.response?.data || err.message);
      alert("Something went wrong while creating the event.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fix My Time</h2>

      <label>Select Event:</label>
      <select value={event} onChange={(e) => setEvent(e.target.value)}>
        <option value="Do Gym">Do Gym</option>
        <option value="Code">Code</option>
      </select>
      <br />

      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
      />
      <br />

      <label>Periodicity:</label>
      <select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <br />

      <button type="submit">Create Event</button>
    </form>
  );
}

export default EventForm;
