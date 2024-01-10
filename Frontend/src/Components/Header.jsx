import { Link } from "react-router-dom";
import PropTypes from 'prop-types'
 
const Header = (props)=>{
    const goToLoginOrSignUp = (isInLogin) => {
        props.handleIsInLoginOrSignUpFromNavbar(isInLogin);
    }

    return(<nav className="main-navbar">
        <div><Link to='/'>Home</Link> <Link to='/about'>About</Link></div>
        {!props.isLoggedIn && <div>
                                    <button onClick={()=>goToLoginOrSignUp(true)}>Login</button>
                                    <button onClick={()=>goToLoginOrSignUp(false)}>Sign Up</button>
                                </div>}
    </nav>)
}

Header.propTypes = {
    isLoggedIn: PropTypes.bool,
    handleIsInLoginOrSignUpFromNavbar: PropTypes.func
}

export default Header;