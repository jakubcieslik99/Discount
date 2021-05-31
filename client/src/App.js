import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
//bootstrap
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
//moment
import '../node_modules/moment/locale/pl'
//components
import Header from './components/Header'
import Footer from './components/Footer'
import NotFound from './components/NotFound'
//user screens
import HomeScreen from './screens/HomeScreen'
import DiscountScreen from './screens/DiscountScreen'
import RegisterScreen from './screens/RegisterScreen'
import SigninScreen from './screens/SigninScreen'
import PasswordResetScreen from './screens/PasswordResetScreen'
import AddScreen from './screens/AddScreen'
import ProfileScreen from './screens/ProfileScreen'
import UsersScreen from './screens/UsersScreen'
import RulesScreen from './screens/RulesScreen'

const App = () => {
    return <BrowserRouter>
        <Header/>
    
        <Switch>
            <Route path="/" exact={true} component={HomeScreen}/>
            <Route path="/discount/:id" component={DiscountScreen}/>
            <Route path="/register" component={RegisterScreen}/>
            <Route path="/signin" component={SigninScreen}/>
            <Route path="/reset" component={PasswordResetScreen}/>
            <Route path="/add" component={AddScreen}/>
            <Route path="/user/:id" component={ProfileScreen}/>
            <Route path="/users" component={UsersScreen}/>
            <Route path="/rules" component={RulesScreen}/>

            <Route component={NotFound}/>
        </Switch>

        <Footer/>
    </BrowserRouter>
}

export default App
