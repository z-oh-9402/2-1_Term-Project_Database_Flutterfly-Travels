import "../Styles/button.css"
import "../Styles/login-signup.css"

import { ImCross } from "react-icons/im";
import PropTypes from 'prop-types'

const DeleteConfirmation = ({goBack, shouldDelete}) => {
    const handleGoBack = () => {
        const box = document.querySelector('.login-signup-container');
        box.classList.add('slide-away');

        box.addEventListener('animationend', () => {
            box.remove();
            goBack();
        });
    }

    return (
        <div className='login-signup-popup'>
            <div className='login-signup-container'>
                <ImCross className='close' onClick={handleGoBack} />
                <h2>Are you sure?</h2>
                <p>
                    This action is permanent. You will not be able <br/>to recover it in the future.
                </p><br/><br/>
                <div style={{display:"flex", justifyContent:"end", alignItems:"center"}}>
                    <button className='custom-btn btn-no' onClick={handleGoBack}>No</button>
                    <button className='custom-btn btn-yes' onClick={shouldDelete}>Yes</button>
                </div>
            </div>
        </div>
    )
}

DeleteConfirmation.propTypes = {
    goBack: PropTypes.func.isRequired,
    shouldDelete: PropTypes.func.isRequired
}

export default DeleteConfirmation;