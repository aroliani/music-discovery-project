import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
<<<<<<< HEAD
=======
  const [success, setSuccess] = useState(null);
>>>>>>> bcba459c6ca9f9c905b29b40e2ca27bbca389683

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
<<<<<<< HEAD
          alert("Account created! Please login.");
          navigate("/login");
=======
          setSuccess("Account created! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
>>>>>>> bcba459c6ca9f9c905b29b40e2ca27bbca389683
        }
      })
      .catch(() => setError("Signup failed."));
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}
<<<<<<< HEAD
=======
        {success && (
          <p
            style={{
              background: "#e6ffe6",
              color: "#388e3c",
              padding: "10px 16px",
              borderRadius: 6,
              marginBottom: 16,
              border: "1px solid #b2dfdb",
            }}
          >
            {success}
          </p>
        )}
>>>>>>> bcba459c6ca9f9c905b29b40e2ca27bbca389683

        <button type="submit">Sign Up</button>
        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
