import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PasswordInput from './PasswordInput';

const Login = (props)=>{
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (e)=>
    {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (text)=>{
        setPassword(text);
    }

    const handleChangeToSignUp = ()=>
    {
        props.goToSignUp();
    }

    const handleDataSubmit = async ()=>{
        if(username!=="" && password!=="")
        {
            const response = await fetch(`http://localhost:3000/customer/${username}/${password}`,{
                method: "GET"
            });

            const result = await response.json();
            if(result.status === -1)
            {
                setUsername("");
                alert("Username does not exist");
            }
            else
            {
                if(result.status === 1)
                {
                    setUsername("");
                    setPassword("");
                    props.setUserInfo(result.data,false);
                    navigate("user");
                }
                else
                {
                    setPassword("");
                    alert("Wrong password");
                }
            }
        }
        else alert("Important field(s) empty!");
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
            <PasswordInput Label="Password: " setPass={handlePasswordChange}/><br/><br/>
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