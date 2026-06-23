import React from 'react'
import OtherUser from './OtherUser';

import {useSelector} from "react-redux";



const OtherUsers = () => {
    const {otherUsers} = useSelector(store=>store.user);
    if (!otherUsers) return; // early return in react
     
    return (
        <div>
            {
                otherUsers?.map((user)=>{
                    return (
                        <OtherUser key={user._id} user={user}/>
                    )
                })
            }
        </div>
    )
}

export default OtherUsers