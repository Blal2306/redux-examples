function createStore(reducer, initialState){
	//make the state inacessible from outside
	//only getState method can access the state
	let state = initialState;
	
	const getState = () => (state);
	
	//this is how actions are sent to the store
	//shouldn't return the state
	//dispatch are fire and forget
	const dispatch = (action) => {state = reducer(state, action)};
	
	//return a new object with state and dispatch function
	return {
		getState,
		dispatch,
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

store.dispatch(addMessageAction1);
const stateV1 = store.getState();
console.log('STATE V1');
console.log(stateV1);

store.dispatch(addMessageAction1);
store.dispatch(addMessageAction1);
const stateV2 = store.getState();
console.log('STATE V2 - should have 3 messages');
console.log(stateV2);
store.dispatch(deleteMessageAction);
console.log('STATE V3 - should have 2 messages after 1 removed');
const stateV3 = store.getState();
console.log(stateV3);

