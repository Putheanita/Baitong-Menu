import { useLoginController } from "../controllers/useLoginController";
import LoginView from "../views/auth/LoginView";
import "./Login.css";

/**
 * Login Page (Controller Container)
 * 
 * Separates Controller Logic from View Presentation:
 * - Controller (state, actions, validation, auth): src/controllers/useLoginController.js
 * - Views (presentation, layout, subviews): src/views/auth/
 */
function Login({ onLoginSuccess, onBack }) {
  const controller = useLoginController({ onLoginSuccess });

  return <LoginView {...controller} onBack={onBack} />;
}

export default Login;