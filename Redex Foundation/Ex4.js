import React from 'react';

//two arguments: Reducer, initial state
function createStore(reducer, initialState){
	//make the state inacessible from outside
	//only getState method can access the state
	let state = initialState;
	
	//list of all subscribers
	const listeners = [];
	
	//this is the only way to get state
	const getState = () => (state);
	
	//this is how actions are sent to the store
	//shouldn't return the state
	//dispatch are fire and forget
	//dispatch will all call all the functions inside the linteners array
	const dispatch = (action) => {
		state = reducer(state, action);
		
		//call each function inside the the listeners array
		listeners.forEach(x => x());
	};
	
	//add a new listner to the store
	//the argument is a function which will be invoked when the state changes
	const subscribe = (listener) => (listeners.push(listener));
	
	//return a new object with state and dispatch function
	return {
		getState,
		dispatch,
		subscribe,
	};
}

function reducer(state, action){
	if(action.type === 'ADD_MESSAGE'){
		return {
			messages: state.messages.concat(action.message),
		};	
	}else if(action.type === 'DELETE_MESSAGE'){
		return {
			messages: [...state.messages.slice(0,action.index),...state.messages.slice(action.index + 1, state.messages.length),],
		};
	}else{
		return state;
	}
}


//TEST CODE
const initialState = {messages: []};
const store = createStore(reducer, initialState);

//action
const addMessageAction1 = {
	type: 'ADD_MESSAGE',
	message: 'ALLAH IS GREAT',
};
const deleteMessageAction = {
	type: 'DELETE_MESSAGE',
	index: 0,
};


class App extends React.Component {
	componentDidMount() {
		//only the top most component subscribes to the store
		//when the contents of the store change, the subscribe method will call the forceUpdate method causing the component 
		//as well the children to force update
		store.subscribe(() => this.forceUpdate());
	}
	render() {
		//only the top most components should interact with store directly
		const messages = store.getState().messages;

		return (
			<div className='ui segment'>
				<MessageView messages={messages} />
				<MessageInput />
			</div>
		);
	}
}
class MessageInput extends React.Component {
	//form state is best handled within the state
	state = {
		value: '',
	};
	
	//capture the input event
	onChange = (e) => {
		this.setState({
			value: e.target.value,
		})
	};
	handleSubmit = () => {
		store.dispatch({
			type: 'ADD_MESSAGE',
			message: this.state.value,
		});
		//clear out the state
		this.setState({
			value: '',
		});
	};
	render(){
		return (
			<div className='ui input'>
				<input onChange={this.onChange} value={this.state.value} type='text' />
				<button onClick={this.handleSubmit} className='ui primary button' type='submit'>Submit</button>
			</div>
		);
	}
}
class MessageView extends React.Component{
	handleClick = (index) => {
		store.dispatch({
			type: 'DELETE_MESSAGE',
			index: index,
		});
	};
	render(){
		const messages = this.props.messages.map((message, index) => (
		<div className = 'comment' key={index} onClick = {() => this.handleClick(index)}>
			{message}
		</div>
		));
		
		return (
			<div className='ui comments'>
				{messages}
			</div>
		);
	}
}
export default App;
