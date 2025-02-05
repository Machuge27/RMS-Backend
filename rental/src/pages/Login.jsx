import React, { useState } from "react";
import '../css/LoginPage.css';
import { useNavigate } from "react-router-dom";
import api from "../Api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import ErrorBox from '../Components/boxes/ErrorBox';
import { useAuth } from "../Components/admin/AuthProvider";
import LoadingIndicator from "../Components/boxes/Loader";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({
    message: "",
    type: "error",
  });
  const [email, setEmail] = useState("");
  const [is_admin, setIsAdmin] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('password');
  const navigate = useNavigate();
  const { login, setBuildings } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || (is_admin && !email)) {
      setMessage({ message: "Please fill all required fields!", type: "warning" });
      setVisible(true);
      return;
    }
    
    try {
      setLoading(true);
      if (is_admin) {
        // Handle 2FA flow for admin
        const res = await api.post("/api/admin/2fa/send-code", { email });
        if (res.status === 200) {
          setLoading(false);
          navigate("/admin-verify-2fa", { state: { email } });
        } else {
          setLoading(false);
          setMessage({
            message: res.data.detail || "An error occurred! Please try again later.",
            type: "error",
          })
          setVisible(true);
        }
        return;
      }

      // Handle normal login flow
      const res = await api.post("/api/token/", {
        username,
        password,
      });

      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);

      login(res.data.refresh, res.data.access, {
        username: res.data.username,
        isAdmin: res.data.isAdmin, // Store role
      });

      if (res.data.buildings) {
        setBuildings({ buildings: res.data.buildings });
      }

      // Navigate based on role
      console.log(res.data.isAdmin);
      if (res.data.isAdmin) {
        setTimeout(() => {
          setMessage({
            message: "Login successful! Redirecting...",
            type: "success",
          })
          setVisible(true);
          navigate("/admin");
        }, 1500);
      } else if (!res.data.isAdmin) {
        setMessage({
          message: "Login successful! Redirecting...",
          type: "success",
        })
        setTimeout(setVisible(true), 1500);
        navigate("/tenant");
      } else {
        setMessage({
          message: "An error occurred! Please try again later.",
          type: "error",
        })
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response) {
        setMessage({
          message : error.response.data.detail || "An error occurred! Please try again later.",
          type: "error",
        });
      } else if (error.request) {
        setMessage(
          "No response received from the server. Please check your network connection."
        );
      } else {
        setMessage("An error occurred while setting up the request. Please try again later.");
      }
      setVisible(true);
    } finally {
      setVisible(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="chkbox">
            <label htmlFor="who">Login as admin: </label>
            <input type="checkbox" className="check" checked={is_admin} onChange={(e) => setIsAdmin(e.target.checked)} />
          </div> */}
          {!is_admin ? (
            <>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
            </>
          ) : (
            <div className="input-group">
              <h4>Enter email to receive the 2FA code</h4>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={inputType}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <span
                className="toggle-password"
                onClick={() => setInputType(inputType === "password" ? "text" : "password")}
              >
                {inputType === "password" ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          <button type="submit" style={{background: loading ? 'transparent' : '#007bff'}}>{loading ? <LoadingIndicator /> : is_admin ? "Next" : "Login"}</button>
        </form>

        <div className="additional-links">
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
          <br />
          <a href="/" className="forgot-password">
            Go home...
          </a>
        </div>
          {visible && (
            <ErrorBox
              message={message.message || "An error occurred! Please try again later."}
              type={message.type || "error"}
              onClose={() => setVisible(false)}
            />
          )}
      </div>
    </div>
  );
};

export default LoginPage;
