import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div>
      <div>
        <FaGoogle className="icon" />
        <FaTwitter className="icon" />
        <FaInstagram className="icon" />
        <FaYoutube className="icon" />
      </div>
      <div>
        <p className="contact-paragraph">Contact Us</p>
      </div>
    </div>
  </div>
)

export default Footer
