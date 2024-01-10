import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props)=>{
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (e)=>
    {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e)=>{
        setPassword(e.target.value);
    }

    const handleChangeToSignUp = ()=>
    {
        props.goToSignUp();
    }

    const handleDataSubmit = async ()=>{
        setUsername("");
        setPassword("");

        const response = await fetch(`http://localhost:3000/user/${username}`,{
            method: "GET"
        });

        const result = await response.json();
        if(result.length === 0)
        {
            alert("Username does not exist");
        }
        else
        {
            if(result[0].PASSWORD === password)
            {
                props.setUserInfo(result[0],false);
                navigate("user");
            }
            else alert("Wrong password");
        }
    }

    const handleGoToHomePage = () =>
    {
        props.goToHome();
        navigate("");
    }

    return(
        <>
            <h1>Login Page</h1>
            <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange}/></label><br/><br/>
            <label>Password: <input type='password' value={password} placeholder='Enter password' onChange={handlePasswordChange}/></label><br/><br/>
            <button onClick={handleDataSubmit}>Submit</button><br/><br/>
            <button onClick={handleChangeToSignUp}>Go to Sign Up</button><br/><br/>
            <button onClick={handleGoToHomePage}>Go to Homepage</button>
        </>
    )

}

Login.propTypes = {
    setUserInfo: PropTypes.func,
    goToSignUp: PropTypes.func,
    goToHome: PropTypes.func
}

export default Login;