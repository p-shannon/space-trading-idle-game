import Auth from './modules/Auth'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor(){
		super()
		this.state = {
			auth: Auth.isUserAuthenticated(),
			data: {},
			activeRegions: [],
            selectedRegion: 0,
			activeRegionData: null,
			didStateUpdate: false,

		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmission = this.handleSubmission.bind(this)
		this.logout = this.logout.bind(this)
		this.saveData = this.saveData.bind(this)
		this.loadData = this.loadData.bind(this)
		this.fetchResourceData = this.fetchResourceData.bind(this)
		this.fetchRegions = this.fetchRegions.bind(this)
		this.occupyRegion = this.occupyRegion.bind(this)
		this.abandonRegion = this.abandonRegion.bind(this)
		this.collectResource = this.collectResource.bind(this)
		this.autoCollect = this.autoCollect.bind(this)
		this.incrementIncome = this.incrementIncome.bind(this)
		this.setUpgrades = this.setUpgrades.bind(this)
        this.showUpgrades = this.showUpgrades.bind(this)
        this.expendResource = this.expendResource.bind(this)
        this.switchRegion = this.switchRegion.bind(this)
	}

	componentDidMount(){
		this.state.auth ? this.loadData() : null
		this.autoCollect()
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
	saveRegionData(id){
		let data = this.state.activeRegionData
		console.log('Saving region data...', data)
		fetch('/game/regionsave',{
			method: "put",
			headers: {
				'Content-Type':'application/json',
				'Authorization': `Token ${Auth.getToken()}`,
				token: Auth.getToken(),
			},
			body: JSON.stringify({id:id,data:data})
		})
		.then(res => res.json())
		.then(res => console.log(res))
		.catch(error => console.error('ERROR',error))
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
    switchRegion(down){
        this.saveData()
        this.saveRegionData(this.state.activeRegions[this.state.selectedRegion].region.id)
        let selection = this.state.selectedRegion
        if(selection===this.state.activeRegions.length-1 && !down){    
            selection = 0
        }
        else if(!down){
            selection++
        }
        else if(selection===0){
            selection = this.state.activeRegions.length-1
        }
        else{
            selection--
        }
        this.setState({
            selectedRegion: selection,
            activeRegionData: JSON.parse(this.state.activeRegions[selection].region.data)
        })
    }
	loadData(){
		console.log('loading game data...')
		this.fetchResourceData()
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
					data: JSON.parse(res.user.data)
				})
				if (res.user.regions.length){
					this.setState({
						activeRegions: res.user.regions,
						activeRegionData: JSON.parse(res.user.regions[0].region.data)
					})
				}
				else{
					this.setState({
						activeRegions: [],
						activeRegionData: null
					})
				}
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
	fetchResourceData(){
		console.log('fetching resources...')
		fetch('/resources')
		.then(res=>res.json())
		.then(res=>{
			this.setState({
				resources: res.resources
			})
		})
	}
	fetchRegions(){
		console.log('fetching regions...')
		fetch('/regions')
		.then(res=>res.json())
		.then(res=>{
			let vacants = res.regions.filter(elem=>!elem.region.user_id)
			console.log('vacants',vacants)
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

	collectResource(id,amount){
        console.log('collecting resource:',id,'Quantity:',amount)
        //We'll be back
		if (this.state.activeRegionData[id]<=0||!this.state.activeRegionData[id]){
			console.log('region void of resource')
			return false
		}
		else if(this.state.activeRegionData[id]<amount){
			amount = this.state.activeRegionData[id]
		}
		console.log('Bing!',this.state.data)
		console.log('Zing!',this.state.activeRegionData)
		let data = Object.assign({},this.state.data)
		if (!data[id]) {
			data = this.setUpgrades(id)
			data[id] = 0
		}
		data[id]+=amount
        data[id] = Math.round(10*data[id])/10
		let regionData = Object.assign({},this.state.activeRegionData)
		regionData[id]-=amount
        regionData[id] = Math.round(10*regionData[id])/10
		this.setState({
			data: data,
			activeRegionData: regionData
		})
        return data
	}

    expendResource(id,amount){
        console.log('expending...')
        let data = Object.assign({},this.state.data)
        if (data[id] < amount){
            return data
        }
        data[id]-=amount
        data[id] = Math.round(10*data[id])/10
        this.setState({
            data: data
        })
        return data
    }
    setRegionPrices(){
        //Shameless copy paste from mdn's random article.
        function getRandomRange(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        //This too
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
    }
	setUpgrades(id){
        //Shameless copy paste from mdn's random article.
        function getRandomRange(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        //This too
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
		console.log('setting next upgrade')
		let data = Object.assign({},this.state.data)
		console.log(this.state.data)
		if(!this.state.data.nextUpgrade){
			data.nextUpgrade = {}
		}
		data.nextUpgrade[id] = {}
        let amount = 0
        let increase = 0
        let resource = 0
        for(let i = 0; i<3; i++){
            if(this.state.data.income){
                if(!this.state.data.income[id]){
                    console.log('buzz')
                    amount = Math.round(10*getRandomArbitrary(6,12))/10
                    increase = Math.round(10*getRandomArbitrary(0.2,0.7))/10
                }
                else{
                    console.log('boop')
                    amount = Math.round(10*getRandomArbitrary(8*(this.state.data.income[id]*1.2),16*(this.state.data.income[id]*1.3)))/10
                    increase = Math.round(10*getRandomArbitrary(0.4*(this.state.data.income[id]/1.5),0.9*(this.state.data.income[id]/1.9)))/10
                }
            }
            else{
                console.log('buozz')
                amount = Math.round(10*getRandomArbitrary(6,12))/10
                increase = Math.round(10*getRandomArbitrary(0.2,0.7))/10
            }
            resource = this.state.activeRegions[getRandomRange(0,this.state.activeRegions.length - 1)].resources[getRandomRange(0,2)].id
            data.nextUpgrade[id][resource]=[amount,increase]
        }
		console.log('temp',data)
		this.setState({
			data: data,
		})
		return data
	}

	incrementIncome(id,expense_id){
        console.log("iI!!")
		if(this.state.data.nextUpgrade){
			let temp = Object.assign({},this.state.data)
            console.log(temp[expense_id],':inventory; ',temp.nextUpgrade[id][expense_id][0],"expense")
			if(temp[expense_id] < temp.nextUpgrade[id][expense_id][0] || !temp[expense_id]){
				console.log('not enough.')
				return false
			}
            console.log('decrement...')
            console.log('temp',temp)
			temp = this.expendResource(expense_id,temp.nextUpgrade[id][expense_id][0])
			if(!this.state.data.income){
				temp.income = {}
			}
            if(!temp.income[id]){
                temp.income[id] = temp.nextUpgrade[id][expense_id][1]
            }
            else{
                temp.income[id] += temp.nextUpgrade[id][expense_id][1]
            }
            this.setUpgrades(id)
			this.setState({
				data: temp
			})
		}
		else{
			console.log('nah')
			return false
		}
	}

	autoCollect(){
		if(!this.state.data || !this.state.data.income){
			setTimeout(()=>{this.autoCollect()},1000)
		}
		else{
			setInterval(()=>{
				for (var resource in this.state.data.income) {
	    			if (this.state.data.income.hasOwnProperty(resource)) {
	        			this.collectResource(resource,this.state.data.income[resource])
	    			}
				}
			},1000)
		}
	}

	showUpgrades(resource){
		if (this.state.data.nextUpgrade){
			if(this.state.data.nextUpgrade[resource]){
                console.log("boom",this.state.resources[Number(Object.keys(this.state.data.nextUpgrade[resource])[0]) - 1].name)
                let array = Object.entries(this.state.data.nextUpgrade[resource])
                console.log(array)
				return(
                    <div>
                    {array.map((upgrade)=>{
                        console.log(upgrade)
                        return(
                            <div>
    						<span>>{upgrade[1][0]} {this.state.resources[Number(upgrade[0]) - 1].name} for an added income of {upgrade[1][1]} per second</span>
                            <button onClick={()=>{this.incrementIncome(resource,Number(upgrade[0]))}}>upgrade</button>
                            </div>
                            )
                        
                    })}
</div>
    				
				)
			}
		}
	}

	

  	render() {
  	console.log(this.state, '<----------- render')
    return (
			<div>
            <marquee>See?<marquee>LITERALLY 9,000,000 HOURS OF CSS!11!!!!!</marquee>See?</marquee>
			{this.state.auth ? (
				<div>
					<p onClick={()=>{this.logout()}}>AUTH ACTIVE</p>
					<button onClick={()=>{this.fetchRegions()}}>Show vacant regions</button>
						{this.state.vacantRegions?(this.state.vacantRegions.map(elem=>{
							return(
								<div>
									<span>{elem.region.id}:{elem.region.name}</span>
									<button onClick={()=>{this.occupyRegion(elem.region.id)}}>Move in</button>
								</div>
						)})):(null)}
				</div>
				):null}
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
				{this.state.activeRegions[this.state.selectedRegion] ? (
					<div>
                    {Object.entries(this.state.data).map((elem)=>{
                        console.log("elem",elem)
                        if (elem[0]==="income"||elem[0]==="nextUpgrade"||elem[0]==="Bings"||!this.state.resources[Number(elem[0]) - 1]){
                            return null
                        }
                        return(
                            <span>[ {this.state.resources[Number(elem[0]) - 1].name}, {elem[1]} ]</span>
                            )
                    })}
                    <p>{this.state.activeRegions[this.state.selectedRegion].region.name}</p>
                        <button onClick={()=>{this.switchRegion()}}>Next Region</button>||<button onClick={()=>{this.switchRegion('down')}}>Prev Region</button>
                    
					{this.state.activeRegions[this.state.selectedRegion].resources.map((elem)=>{
						return(<div>
						<span>{this.state.data[elem.id]||0} {elem.name}</span>
						<button onClick={()=>{
							this.collectResource(elem.id,1)
						}}>Collect</button>
                        <span>{this.state.data.income?(this.state.data.income[elem.id]||0):(0)}/sec</span>
						<p>Upgrades:</p>
						{this.showUpgrades(elem.id)}
                        <hr/>
						</div>)
					})} 

						<p>{this.state.data.bings} bings</p>
						<button onClick={()=>{
							console.log('Bing!',this.state.data.bings)
							let data = Object.assign({},this.state.data)
							data.bings++
							this.setState({
								data: data
							})
						}}>Bing!</button>
						<button onClick={()=>{this.saveData(),this.saveRegionData(this.state.selectedRegion)}}>Save!</button>
						<div>

						<p>Your regions:</p>
						{this.state.activeRegions.map((elem)=>{
							return( 
								<div>
									<span>{elem.region.name}</span>
									<button onClick={()=>{this.abandonRegion(elem.region.id)}}>Abandon</button>
								</div>
							)
						})}
						<button onClick={()=>{this.fetchRegions()}}>Show vacant regions</button>
						{this.state.vacantRegions?(this.state.vacantRegions.map(elem=>{
							return(
								<div>
									<span>{elem.region.id}:{elem.region.name}</span>
									<button onClick={()=>{this.occupyRegion(elem.region.id)}}>Move in</button>
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
