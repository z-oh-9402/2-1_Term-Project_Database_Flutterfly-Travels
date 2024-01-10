import { Outlet } from "react-router-dom";
import Header from "./Header";
import PropTypes from 'prop-types'

const Home = (props) =>
{
    return(<>
        <Header handleIsInLoginOrSignUpFromNavbar={props.handleIsInLoginOrSignUpFromNavbar} isLoggedIn={props.isLoggedIn}/>
        <Outlet/>
    </>)
}

Home.propTypes = {
    isLoggedIn: PropTypes.bool,
    handleIsInLoginOrSignUpFromNavbar: PropTypes.func
}

export default Home;