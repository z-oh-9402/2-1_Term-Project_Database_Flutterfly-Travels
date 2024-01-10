import { Link } from "react-router-dom";
import PropTypes from 'prop-types'
 
const Header = (props)=>{
    const goToLoginOrSignUp = (isInLogin) => {
        props.handleIsInLoginOrSignUpFromNavbar(isInLogin);
    }

    return(<nav className="main-navbar">
        <div><Link to='/' className="basicInfo">Home</Link> <Link to='/about' className="basicInfo">About</Link></div>
        {props.isLoggedIn ? <div><h4 className="username">Hello <Link to='user' className="underlinedLink">{props.userInfo.USERNAME}</Link></h4></div> : <div>
                                    <button onClick={()=>goToLoginOrSignUp(true)}>Login</button>
                                    <button onClick={()=>goToLoginOrSignUp(false)}>Sign Up</button>
                                </div>}
    </nav>)
}

Header.propTypes = {
    isLoggedIn: PropTypes.bool,
    handleIsInLoginOrSignUpFromNavbar: PropTypes.func,
    userInfo: PropTypes.object
}

export default Header;