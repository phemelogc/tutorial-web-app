import "../styles/login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faFacebook} from '@fortawesome/free-brands-svg-icons'

export default function Login() {
  return (

    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please login to your account</p>
        </div>
        

        <form className="login-form">
          <input className="login-input" type="email" placeholder="Email Address" required />
          <input className="login-input" type="password" placeholder="Password" required />
          <p>Forgot password?</p>
          <button className="login-button">Login</button>
          
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="login-social-buttons">
          <button><FontAwesomeIcon icon={faGoogle} /></button>
          <button><FontAwesomeIcon icon={faFacebook} /></button>
        </div>

        <div className="login-footer">
          <p>Don’t have an account? <a href="/register">Sign up</a></p>
          <a href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
