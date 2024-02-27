import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';

const Landing = () => {
    
    const refWolverine = useRef(null);
    const [btn, setBtn] = useState(false);
    
    useEffect(() => {
        refWolverine.current.classList.add('startingImg');
        setTimeout(() => {
            refWolverine.current.classList.remove('startingImg');
            setBtn(true);
        }, 1000)
    }, [])

    const setLeftImage = () => {
        refWolverine.current.classList.add('leftImg');
    }

    const setRightImage = () => {
        refWolverine.current.classList.add('rightImg');
    }

    const clearImage = () => {
        if (refWolverine.current.classList.contains('leftImg')) {
            refWolverine.current.classList.remove('leftImg');
        } else if (refWolverine.current.classList.contains('rightImg')) {
            refWolverine.current.classList.remove('rightImg')
        }
    }

    const displayBtn = btn && (
        <Fragment>
            <div className="leftBox">
                <Link 
                    onMouseOver={setLeftImage} 
                    onMouseOut={clearImage} 
                    className="btn-welcome"
                    to="/signup">
                    Inscription
                </Link>
            </div>
            <div className="rightBox">
                <Link 
                    onMouseOver={setRightImage} 
                    onMouseOut={clearImage} 
                    className="btn-welcome"
                    to="/login">
                    Connexion
                </Link>
            </div>
        </Fragment>
    )
    return (
        <main ref={refWolverine} className='welcomePage'>
            { displayBtn }
        </main>
    )
}

export default Landing
