import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    return tokenString
  };
  const [token, setToken] = useState(getToken());
  const [clicked, setClicked] = useState(false)
  const saveToken = userToken => {
    sessionStorage.setItem('token', userToken);
    setToken(userToken);
    setClicked(true);
  };
  return {
    setToken: saveToken,
    token,
    clicked
  }
}
