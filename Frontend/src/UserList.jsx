import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Outlet } from "react-router-dom";

const UserList = (props) => {
    const [serial,setSerial] = useState()
    const navigate = useNavigate();
    const info = props.data;

    const handleClick = (ind) =>{
        setSerial(ind);
        navigate(`${ind}`);
    }

    return(
        <>
            <ul>
                {info.map((data,index)=>
                        <Fragment key={index}>
                            <li onClick={() => handleClick(index)}>{data.FIRST_NAME} {data.LAST_NAME}</li>
                            {index===serial && <Outlet/>}
                        </Fragment>
                    )}
            </ul>
            <button onClick={() => navigate("/")}>Clear User List</button>
        </>
    );
}

UserList.propTypes = {
    data: PropTypes.array
}

export default UserList;