import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const UserDetails = (props)=>
{
    const params = useParams();
    const listOfInfo = props.data
    const info = listOfInfo[params.userId];

    return(<p>
        First Name: {info.FIRST_NAME}<br/>
        Last Name: {info.LAST_NAME}<br/>
        Email: {info.EMAIL}<br/>
        Phone Number: {info.PHONE_NUMBER}<br/>
        Job ID: {info.JOB_ID}<br/>
        Salary: {info.SALARY}<br/>
    </p>)
}

UserDetails.propTypes = {
    data: PropTypes.array,
}

export default UserDetails;