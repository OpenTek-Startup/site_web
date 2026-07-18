import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./login.css";

export function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  if (user) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <img
          src="/opentek-full-logo.png"
          alt="OpenTek"
          className="admin-login__logo"
        />
        <h1>Espace administration</h1>
        <p className="admin-login__subtitle">
          Connectez-vous pour gerer le contenu du site
        </p>

        {error && <div className="admin-login__error">{error}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
