import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

import './App.css';

const particlesOptions = {
	particles: {
		number: {
			value: 180,
			density: {
				enable: true,
				value_area: 800,
			},
		},
	},
};

const INITIALSTATE = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: '',
	},
};

class App extends Component {
	constructor() {
		super();
		this.state = INITIALSTATE;
	}

	loadUser = user => {
		this.setState({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				entries: user.entries,
				joined: new Date(),
			},
		});
	};

	calculateFaceLocation = data => {
		const clarifaiFace =
			data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			topRow: height * clarifaiFace.top_row,
			rightCol: width * (1 - clarifaiFace.right_col),
			bottomRow: height * (1 - clarifaiFace.bottom_row),
			leftCol: width * clarifaiFace.left_col,
		};
	};

	displayFaceBox = box => {
		this.setState({ box });
	};

	onInputChange = event => this.setState({ input: event.target.value });

	onRouteChange = route => {
		if (route === 'signout' || route === 'signin' || route === 'register') {
			this.setState(INITIALSTATE);
		} else if (route === 'home' || route === 'image') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route });
	};

	onButtonSubmit = () => {
		const { input } = this.state;
		this.setState({ imageUrl: input });
		fetch('https://smart-brain-gwendev-api.herokuapp.com/imageUrl', {
			method: 'post',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({
				input: this.state.input,
			}),
		})
			.then(response => response.json())
			.then(response => {
				if (response) {
					fetch('https://smart-brain-gwendev-api.herokuapp.com/image', {
						method: 'put',
						headers: { 'Content-type': 'application/json' },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then(response => response.json())
						.then(count =>
							this.setState(Object.assign(this.state.user, { entries: count }))
						)
						.catch(console.log);
				}
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch(err => console.log('error: ', err));
	};

	render() {
		const { isSignedIn, imageUrl, box, route } = this.state;
		return (
			<div className='App'>
				<Particles className='particles' params={particlesOptions} />
				<Navigation
					onRouteChange={this.onRouteChange}
					isSignedIn={isSignedIn}
				/>
				{route === 'home' ? (
					<div>
						<Logo />
						<Rank
							name={this.state.user.name}
							entries={this.state.user.entries}
						/>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}
						/>
						<FaceRecognition box={box} imageUrl={imageUrl} />
					</div>
				) : route === 'register' ? (
					<Register
						loadUser={this.loadUser}
						onRouteChange={this.onRouteChange}
					/>
				) : (
					<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
				)}
			</div>
		);
	}
}

export default App;
