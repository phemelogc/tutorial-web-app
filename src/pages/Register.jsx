import "../styles/register.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faFacebook} from '@fortawesome/free-brands-svg-icons'

export default function Register() {
  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Create an account...</h1>

        <form className="register-form">
          <input className="register-input" type="text" placeholder="Full Name" />
          <input className="register-input" type="email" placeholder="Email Address" />
          <input className="register-input" type="password" placeholder="Password" />
          <input className="register-input" type="password" placeholder="Confirm Password" />
          <button className="register-button">Sign Up</button>
        </form>

        <div className="divider">
            <span>OR</span>
        </div>
        
        <div className="login-social-buttons">
            <button><FontAwesomeIcon icon={faGoogle} /></button>
            <button><FontAwesomeIcon icon={faFacebook} /></button>
        </div>

        <div className="register-footer">
          <p>Already have an account? <a href="/">Login</a></p>
        </div>
      </div>
    </div>
  );
}
