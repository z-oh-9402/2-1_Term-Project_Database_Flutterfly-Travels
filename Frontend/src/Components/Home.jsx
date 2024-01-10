import { Outlet } from "react-router-dom";
import Header from "./Header";
import PropTypes from 'prop-types'

const Home = (props) =>
{
    return(<>
        <Header handleIsInLoginOrSignUpFromNavbar={props.handleIsInLoginOrSignUpFromNavbar} isLoggedIn={props.isLoggedIn} userInfo={props.userInfo}/>
        <Outlet/>
    </>)
}

Home.propTypes = {
    isLoggedIn: PropTypes.bool,
    handleIsInLoginOrSignUpFromNavbar: PropTypes.func,
    userInfo:PropTypes.object
}

export default Home;