import React, {useContext, useState, useEffect} from 'react';
import './App.css';
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import HomePage from './pages/homepage/Homepage'
import { BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom'
import {getCookie, setCookie, removeCookie} from './helper/cookie'
import axios from 'axios'
import {getUser, setUserCookies} from './helper/auth'
import AppContext from './Appcontext'
import socketIOClient from 'socket.io-client'

function App(props) {
  const userCookies = getUser()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({
    username: userCookies ? userCookies.username : null,
    fullname: userCookies ? userCookies.fullname : null,
    avatar: userCookies ? userCookies.avatar : null
  })
  const changeUser = (state) => {
    setUserCookies(state.username, state.fullname, state.avatar)
    setUser({...state})
}

  useEffect(() => {
    const socket = socketIOClient("http://localhost:5000");
    socket.emit('change color', 'blue')
  })

  const socket = socketIOClient("http://localhost:5000");
  socket.on('change color', (col) => {
    console.log(col)
  })


  return (
    <AppContext.Provider value={{
      user,
      setUser: changeUser,
      loading,
      setLoading
    }}>
      <div className="App">
        <Router>
          <Switch>
            <Route exact={true} path="/">
                <HomePage></HomePage>
            </Route>
            <Route path="/login">
                <Login></Login>
            </Route>
            <Route path="/register">
                <Register></Register>
            </Route>
          </Switch>
        </Router>
    </div>
    </AppContext.Provider>

  );
}

export default App;
