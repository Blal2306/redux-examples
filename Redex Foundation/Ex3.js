function createStore(reducer, initialState){
	//make the state inacessible from outside
	//only getState method can access the state
	let state = initialState;
	
	//list of all subscribers
	const listeners = [];
	
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

//this function will print the current state everytime store updates
const listener = () => {
	console.log('Current state: ');
	console.log(store.getState());
}

//subscribe the function to the store
store.subscribe(listener);

//dispatch the actions
store.dispatch(addMessageAction1);
store.dispatch(addMessageAction1);
store.dispatch(addMessageAction1);
store.dispatch(deleteMessageAction);

