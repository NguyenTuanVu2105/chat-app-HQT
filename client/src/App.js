import React, {useContext, useState, useEffect} from 'react';
import './App.css';
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import HomePage from './pages/homepage/Homepage'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {getUser, setUserCookies, createAuthApi} from './helper/auth'
import AppContext from './context/Appcontext'
import AddContactModal from './pages/homepage/components/content/chatboxlist/AddContactModal';
import { socket } from './helper/socket';
// import moment from 'moment'

function App(props) {
  const [user, setUser] = useState({
    id:  null,
    email: null,
    name: null,
    avatar: null,
    address: null
  })
  const [contacts, setContacts] = useState([])
  const [requests, setRequests] = useState([])
  const [contactVisible, setContactVisible] = useState(false)
  const [rooms, setRooms] = useState([])
  const getStatus = async() => {
    if (user.id) {
      const listRequest = await createAuthApi({url: '/api/requests/imcoming', method:'GET'})
      const listContacts = await createAuthApi({url: '/api/contacts', method: 'GET'})
      if (!listContacts.error) setContacts(contact => listContacts)
      if (!listRequest.error) setRequests(request => listRequest)
    }
  }

  const getRoom = async() => {
    if (user.id) {
      const listRoom = await createAuthApi({url: '/api/rooms', method:'GET'})
      listRoom.forEach(x => {
        socket.on(`new message ${x.id}`, async function(data) {
          var y = await createAuthApi({url: '/api/rooms', method:'GET'})
          setRooms(rooms => y)
        })
      });
      console.log({listRoom})
      if (!listRoom.error) setRooms(rooms => listRoom)
    }
  }
  const _fetchData = async () => {
    const user = await getUser()
    setUser({
      id:  user ? user.id : null,
      email: user ? user.email : null,
      name: user ? user.name : null,
      avatar: user ? user.avatar : null,
      address: user ? user.address : null
    })
  }

  useEffect(()=> {
    
    _fetchData()
  }, [])

  useEffect(()=> {
    getStatus()
    getRoom()
  }, [user])
  
  const changeUser = (state) => {
    setUser({...state})
}

  useEffect(() => {
    if (user.id) {
      socket.on(`new group ${user.id}`, function() {
        getStatus()
        getRoom()
      })
    }

  }, [user])

  return (
    <AppContext.Provider value={{
      user,
      setUser: changeUser,
      requests,
      setRequests,
      contacts,
      setContacts,
      contactVisible,
      setContactVisible,
      rooms,
      setRooms,
      getStatus,
      getRoom
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
        <AddContactModal
            visible = {contactVisible}
            setVisible = {setContactVisible}
        >
        </AddContactModal>
    </div>
    </AppContext.Provider>

  );
}

export default App;
