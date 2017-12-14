import Auth from './modules/Auth'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor(){
		super()
		this.state = {
			auth: Auth.isUserAuthenticated(),

		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmission = this.handleSubmission.bind(this)
		this.logout = this.logout.bind(this)
	}

	handleChange(event){
		console.log('Tick!')
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	handleSubmission(e,url,method){
		const decideBodyType = ()=>{
			switch(url){
				case '/login':
				return JSON.stringify({
				username: this.state.loginUsername,
				password: this.state.loginPassword,
				})

				case '/users':
				return JSON.stringify({
				user: {
					username: this.state.registerUsername,
					password: this.state.registerPassword,
					}
				})
			}

		}
		e.preventDefault()
		console.log(`Fetching to: ${url} with the ${method} method.`)
		fetch(url,
		{
			method: method,
			headers: {
				'Content-Type':'application/json',
			},
			body: decideBodyType(),
		})
		.then(res => res.json())
		.then(res => {
			console.log('response',res)
			if (res.token){
				Auth.authenticateToken(res.token)
				this.setState({
					auth: Auth.isUserAuthenticated(),
					loginUsername: "",
					loginPassword: "",
					registerUsername: "",
					registerPassword: "",

				})
			}
			else{
				console.warn('Token not recieved!')
			}
		})
		.catch(error => console.warn('error',error))
	}

	logout(){
		fetch('/logout',
		{
			method: "delete",
			headers: {
				'Authorization': `Token ${Auth.getToken()}`,
				token: Auth.getToken(),
			}
		})
		.then(res => {
			Auth.deauthenticateUser()
			console.log('res',res)
			this.setState({
				auth: Auth.isUserAuthenticated(),
				loginUsername: "",
				loginPassword: "",
			})
		})
	}

  render() {
    return (
			<div>
			{this.state.auth ? (<p onClick={()=>{this.logout()}}>AUTH ACTIVE</p>):null}
				<form onSubmit={(e)=>{this.handleSubmission(e,'/login','POST')}}>
					<label>Login</label>
					<input type="text" name="loginUsername" value={this.state.loginUsername} onChange={(e)=>{this.handleChange(e)}}/>
					<input type="text" name="loginPassword" value={this.state.loginPassword} onChange={(e)=>{this.handleChange(e)}}/>
					<input type="submit" value="Login"/>
				</form>
				<br/>
				<form onSubmit={(e)=>{this.handleSubmission(e,'/users','POST')}}>
					<label>Register</label>
					<input type="text" name="registerUsername" value={this.state.registerUsername} onChange={(e)=>{this.handleChange(e)}}/>
					<input type="text" name="registerPassword" value={this.state.registerPassword} onChange={(e)=>{this.handleChange(e)}}/>
					<input type="submit" value="Sign Up"/>
				</form>
			</div>
    );
  }
}

export default App;
