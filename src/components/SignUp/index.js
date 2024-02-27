import { useState } from 'react'
import { auth, user } from '../Firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { setDoc } from 'firebase/firestore';

const SignUp = () => {

  const data = {
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const [loginData, setLoginData] = useState(data);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = e => {
    e.preventDefault();
    const { email, password,pseudo } = loginData;
    createUserWithEmailAndPassword(auth, email, password)
    .then(authUser => {
      return setDoc(user(authUser.user.uid), {
        pseudo,
        email
      })
    })
    .then(() => {
      setLoginData({...data});
      setError('');
      navigate('/Welcome');
    })
    .catch(error => {
      setError(error);
      setLoginData({...data});

    })
  }

  const { pseudo, email, password, confirmPassword } = loginData;

  const displayButtonSubmit = 
    pseudo !== '' && email !== '' & password !== '' && password === confirmPassword
    ? <button >Inscription</button> 
    : <button disabled>Inscription</button> 
  
  const errorMessage = error !== '' && <span>{ error.message }</span>


  return (
    <div>
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup">
                </div>
                <div className="formBoxRight">
                    <div className="formContent">
                      { errorMessage }
                      <h2>Inscription</h2>
                        <form onSubmit={ handleSubmit }>
                          <div className="inputBox">
                            <input onChange={handleChange} value={pseudo} type='text' id='pseudo' required autoComplete='off'/>
                            <label htmlFor='pseudo'>Pseudo</label>
                          </div>
                          <div className="inputBox">
                            <input onChange={handleChange} type='email' id='email' value={email} required autoComplete='off'/>
                            <label htmlFor='email'>Email</label>
                          </div>
                          <div className="inputBox">
                            <input onChange={handleChange} type='password' id='password' value={password} required autoComplete='off'/>
                            <label htmlFor='password'>Mot de passe</label>
                          </div>
                          <div className="inputBox">
                            <input onChange={handleChange} type='password' id='confirmPassword' value={confirmPassword} required autoComplete='off'/>
                            <label htmlFor='confirmPassword'>Confirmer le mot de passe</label>
                          </div>
                          { displayButtonSubmit }
                        </form>
                        <div className='linkContainer'>
                          <Link className='simpleLink' to='/login'>
                            Déjà inscrit? Connectez-vous.
                          </Link>
                        </div>
                      
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default SignUp
