import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../Firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const Logout = () => {

    const [checked, setChecked] = useState(false); 
    const navigate = useNavigate();
    useEffect(() => {
        if(checked) {
            signOut(auth)
            .then(() => {
                console.log("Vous êtes déconnectés");
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            })
            .catch((error) => {
                console.log('Oups, nous avons une erreur');
            })
        }
    }, [checked, navigate])

    const handleChange = e => {
        setChecked(e.target.checked);
    }
    return (
        <div className='logoutContainer'>
            <label className="switch">
                <input type='checkbox' checked={ checked } onChange={handleChange}/>
                <span className="slider round"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Déconnexion">

                </span>
            </label>
            <Tooltip id="my-tooltip" place='left' effect='solid'/>
        </div>
    )
}

export default Logout
