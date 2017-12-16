import Auth from './modules/Auth'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor(){
		super()
		this.state = {
			auth: Auth.isUserAuthenticated(),
			data: null
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmission = this.handleSubmission.bind(this)
		this.logout = this.logout.bind(this)
		this.saveData = this.saveData.bind(this)
		this.loadData = this.loadData.bind(this)
		this.fetchRegions = this.fetchRegions.bind(this)
		this.occupyRegion = this.occupyRegion.bind(this)
		this.abandonRegion = this.abandonRegion.bind(this)
	}

	componentDidMount(){
		this.state.auth ? this.loadData() : null
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
		.then(res => {
			this.loadData()
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
				data: null,
			})
		})
	}

	saveData(){
		let data = this.state.data
		console.log('Saving game data...', data)
		fetch('/game/save',{
			method: "put",
			headers: {
				'Content-Type':'application/json',
				'Authorization': `Token ${Auth.getToken()}`,
				token: Auth.getToken(),
			},
			body: JSON.stringify({data:data})
		})
		.then(res => res.json())
		.then(res => console.log(res))
		.catch(error => console.error('ERROR',error))
	}

	loadData(){
		console.log('loading game data...')
		fetch('/game/load',{
			headers:{
				"Authorization":`Token ${Auth.getToken()}`,
				token: Auth.getToken()
				}
			}
		)
		.then(res=>res.json())
		.then(res=>{
			console.log('res',res)
			if (res.user.data){
				console.log('YES!')
				this.setState({
					data: JSON.parse(res.user.data),
					activeRegions: res.user.regions
				})
			}
			else{
				console.warn('Why!?!?')
				this.setState({
					data: {
						bings: Number(0)
					}
				})
			}
		})
		.catch(error => console.error('ERROR',error))
	}

	fetchRegions(){
		console.log('fetching regions...')
		fetch('/regions')
		.then(res=>res.json())
		.then(res=>{
			let vacants = res.regions.filter(region=>!region.user_id)
			this.setState({
				vacantRegions : vacants
			})
		})
		.catch(error => console.error('ERROR',error))
	}

	occupyRegion(region_id){
		this.saveData()
		fetch('/game/occupy',{
			method: "put",
			headers: {
				'Content-Type':'application/json',
				'Authorization': `Token ${Auth.getToken()}`,
				token: Auth.getToken()
			},
			body: JSON.stringify({id:region_id})
		})
		.then(res=>res.json())
		.then(res=>{
			this.loadData()
			this.setState({
				vacantRegions:null
			})
		})
		.catch(error=>console.error('ERROR',error))
	}

	abandonRegion(region_id){
		this.saveData()
		fetch('/game/abandon',{
			method: "put",
			headers: {
				'Content-Type':'application/json',
				'Authorization': `Token ${Auth.getToken()}`,
				token: Auth.getToken()
			},
			body: JSON.stringify({id:region_id})
		})
		.then(res=>res.json())
		.then(res=>{
			this.loadData()
		})
		.catch(error=>console.error('ERROR',error))
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
				<br/>
				{this.state.data ? (
					<div>
						<p>{this.state.data.bings} bings</p>
						<button onClick={()=>{
							console.log('Bing!',this.state.data.bings)
							let data = Object.assign({},this.state.data)
							data.bings++
							this.setState({
								data: data
							})
						}}>Bing!</button>
						<button onClick={()=>{this.saveData()}}>Save!</button>
						<div>
						<p>Your regions:</p>
						{this.state.activeRegions.map((region)=>{
							return( 
								<div>
									<span>{region.name}</span>
									<button onClick={()=>{this.abandonRegion(region.id)}}>Abandon</button>
								</div>
							)
						})}
						<button onClick={()=>{this.fetchRegions()}}>Show vacant regions</button>
						{this.state.vacantRegions?(this.state.vacantRegions.map(region=>{
							return(
								<div>
									<span>{region.id}:{region.name}</span>
									<button onClick={()=>{this.occupyRegion(region.id)}}>Move in</button>
								</div>
						)})):(null)}
						</div>
					</div>
					):(
					null
					)}
			</div>
    );
  }
}

export default App;
