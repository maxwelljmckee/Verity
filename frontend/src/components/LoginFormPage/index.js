import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';


import { loginUser } from '../../store/session';


const LoginFormPage = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credential, password)).catch((res) => 
      { if (res.data && res.data.errors) setErrors(res.data.errors) });
  }

  return (
    <React.Fragment>
      <h1>login form</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <input
          name='credential'
          type='text'
          placeholder='Enter Username or Email'
          onChange={(e) => setCredential(e.target.value)}
          value={credential}
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Enter password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Submit</button>
      </form>
    </React.Fragment>
  )
}

export default LoginFormPage;
