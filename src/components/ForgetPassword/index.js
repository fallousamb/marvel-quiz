import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';

const styleSuccess = {
    border: "1px solid green",
    backgroundColor: "grren",
    color: "#ffffff"
}
const ForgetPassword = () => {

    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        sendPasswordResetEmail(email)
        .then(() => {
            setError(null);
            setSuccess(`Consultez votre email ${email} pour changer le mot de passe`);
            setEmail('');
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        })
        .catch((error) => {
            setError(error);
            setEmail('');
        })
    }
    
    const disabled = email === '';
    const displaySuccessMessage = success && <span style={styleSuccess}>{success}</span>;
    const displayErrorMessage = error && <span>{ error.message }</span>
    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftForget"></div>
                <div className="formBoxRight">
                    <div className="formContent">
                        {
                            displaySuccessMessage
                            
                        }
                        {
                            displayErrorMessage
                        }
                        <h2>Mot de passe oublié</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                            <input onChange={e => setEmail(e.target.value)} type='email' id='email' value={email} required autoComplete='off'/>
                            <label htmlFor='email'>Email</label>
                            </div>   
                            <button disabled={ disabled }>Récupérer</button>             
                        </form>
                        <div className='linkContainer'>
                            <Link className='simpleLink' to='/login'>
                                Déjà inscris ? Connectez-vous.
                            </Link>
                        </div>
                        
                    </div>
                </div>
        </div>
        </div>
    )
}

export default ForgetPassword
