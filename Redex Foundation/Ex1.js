function reducer(state, action){
	if(action.type === 'INCREMENT'){
		return state+action.amount;
	}else if(action.type === 'DECREMENT'){
		return state-action.amount;
	}else{
		return state;
	}
}


function createStore(reducer){
	//make the state inacessible from outside
	//only getState method can access the state
	let state = 0;
	
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

//TEST CODE
const store = createStore(reducer);
const incrementAction = {
	type: 'INCREMENT',
	amount: 3,
}

store.dispatch(incrementAction);
console.log(store.getState()); // --> 3