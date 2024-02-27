import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebaseConfig';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btn, setbtn] = useState(false);
  const [error, seterror] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(password.length > 5 && email !== '') {
      setbtn(true)
    } else if (btn) {
      setbtn(false);
    }
  }, [password, email, btn])


  const handleSubmit = e => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then(user => {
      setEmail('')
      setPassword('')
      navigate('/welcome', { replace: true})
    })
    .catch(error => {
      seterror(error);
      setEmail('')
      setPassword('')
    })
  }

  const errorMessage = error !== '' && <span>{ error.message }</span>


  const displayButtonLogin = <button disabled={ btn ? false: true}>Connexion</button>;

  return (
    <div className="signUpLoginBox">
        <div className="slContainer">
          <div className="formBoxLeftSignup">
          </div>
          <div className="formBoxRight">
            <div className="formContent">
                { errorMessage }
                <h2>Connexion</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="inputBox">
                      <input onChange={e => setEmail(e.target.value)} type='email' id='email' value={email} required autoComplete='off'/>
                      <label htmlFor='email'>Email</label>
                    </div>
                    <div className="inputBox">
                      <input onChange={e => setPassword(e.target.value)} type='password' id='password' value={password} required autoComplete='off'/>
                      <label htmlFor='password'>Mot de passe</label>
                    </div>
                    { displayButtonLogin }                        
                  </form>
                  <div className='linkContainer'>
                    <Link className='simpleLink' to='/signup'>
                      Nouveau sur Marquiz ? Incrivez-vous maintenant.
                    </Link>
                  </div>
                  <br />
                  <div className='linkContainer'>
                    <Link className='simpleLink' to='/forgetpassword'>
                      Mot de passe oublié? Récupérez le ici.
                    </Link>
                  </div>
                
            </div>
          </div>
        </div>
    </div>
  )
}

export default Login
