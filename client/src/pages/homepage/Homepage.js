import React, {useContext} from 'react' 
import './Homepage.scss'
import Header from './components/Header'
import Content from './components/Content'
import AppContext from '../../Appcontext'
import {withRouter} from 'react-router-dom'

const Homepage = (props) => {
    const context = useContext(AppContext)
    if (!context.user.username) {
        console.log(context.user.username)
        props.history.push("/login")
    }
    return (
        <div className="homepage">
            <Header></Header>
            <Content></Content>
        </div>
    )
}

export default withRouter(Homepage)