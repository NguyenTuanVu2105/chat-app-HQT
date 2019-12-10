import React, {useContext, useEffect, useState} from 'react' 
import './Homepage.scss'
import Header from './components/Header'
import Content from './components/Content'
import {withRouter} from 'react-router-dom'
import {checkAuth} from '../../helper/auth'
import Appcontext from '../../context/Appcontext'

const Homepage = (props) => {
    
    if (!checkAuth()) {
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