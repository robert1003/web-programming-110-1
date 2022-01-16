import { createContext, useContext, useState, useEffect } from 'react';

const LoginContext = createContext({
	hasLogin: null,
	userName: "",
	token: "",

	setLoginStatus: () => {},
	setUserName: () => {},
	setToken: () => {}
});

const LoginProvider = (props) => {
	const [hasLogin, setHasLogin] = useState(JSON.parse(localStorage.getItem("hasLogin")));
	const [userName, _setUserName] = useState(JSON.parse(localStorage.getItem("userName")));
	const [token, _setToken] = useState(JSON.parse(localStorage.getItem("token")));

	const setLoginStatus = (status) => {
		setHasLogin(status);
		localStorage.setItem("hasLogin", JSON.stringify(status));
	};

	const setUserName = (name) => {
		_setUserName(name);
		localStorage.setItem("userName", JSON.stringify(name));
	};

	const setToken = (token) => {
		_setToken(token);
		localStorage.setItem("token", JSON.stringify(token));
	}

	return (
    <LoginContext.Provider
      value={{
        hasLogin,
        userName,
        token,
        setLoginStatus,
        setUserName,
        setToken
      }}
      {...props}
    />
  );
};

function useLogin() {
  return useContext(LoginContext);
}

export { LoginProvider, useLogin };