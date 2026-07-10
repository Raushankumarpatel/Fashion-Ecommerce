import { useState } from "react";
import API from "../api/api";

function Returns() {
  const [form, setForm] = useState({
    orderId: "",
    reason: "",
  });

  const submitReturn = async (e) => {
    e.preventDefault();

    await API.post("/returns", form);

    alert("Return Request Submitted");

    setForm({
      orderId: "",
      reason: "",
    });
  };

  return (
    <div>
      <h1>Return Request</h1>

      <form onSubmit={submitReturn}>
        <input
          type="text"
          placeholder="Order ID"
          value={form.orderId}
          onChange={(e) =>
            setForm({ ...form, orderId: e.target.value })
          }
        />

        <textarea
          placeholder="Return Reason"
          value={form.reason}
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
        />

        <button type="submit">Submit Return</button>
      </form>
    </div>
  );
}

export default Returns;