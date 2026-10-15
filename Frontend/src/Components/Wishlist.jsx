import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
import { ImCross } from "react-icons/im";
import PropTypes from 'prop-types';
import WishlistBar from "./WishlistBar";
import { apiFetch } from '../api';


const Wishlist = (props)=>{
    const {userInfo} = useContext(UserInfoContext);
    const {setShowWishlist} = props;
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            const response = await apiFetch(`http://localhost:3000/wishlist/fetch?userId=${userInfo.user_id}`, {
                method: "GET"
            });

            const result = await response.json();
            setWishlist(result);
        }

        fetchWishlist();
    }, []);

    const handleGoToCurrentPage = () => {
        setShowWishlist(false);
    }

    return(
        <div className='login-signup-popup'>
            <div className="close-container" style={{position: 'relative'}}>
                <ImCross className='close' onClick={handleGoToCurrentPage} />

                <div className='login-signup-container trip-container'>
                    <h2>Wishlist -</h2>
                    <div className='category-data'>
                        {wishlist.map((list, index) =>
                            list.items.length>0 ?
                            list.items.map((item, index) =>
                                <WishlistBar key={index} item={item} itemType={list.category} index={`${index}`} setShowWishlist={setShowWishlist}/>
                            )
                            :
                            <h3 key={index}>{list.category} in your wishlist</h3>
                        )}
                    </div>
                </div>
            </div>
        </div>
)}

Wishlist.propTypes = {
    setShowWishlist: PropTypes.func
}

export default Wishlist;