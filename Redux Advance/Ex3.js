import React from 'react';
import uuid from 'uuid';
import { createStore, combineReducers } from 'redux';

//reusable function
//given the list of thread and id of the thread, 
//return the index of the thread that is active
function findThreadIndex(threads, action) 
{
  switch (action.type) 
  {
    case 'ADD_MESSAGE': 
    {
      //for list of threads, compare the id passed in action with the current thread id
      return threads.findIndex((t) => t.id === action.threadId);
    }
    case 'DELETE_MESSAGE': 
    {
      //search all message in all threads and find the index of the thread that has the message that we 
      //want to delete
      return threads.findIndex((t) => t.messages.find((m) => (m.id === action.id)));
    }
  }
}

//* We have different reducers to manage different parts of the state
//* In our state object, we have 2 properties, activeThreadId and threads,
//  so we have 2 different reducers for these two parts
const reducer = combineReducers(
{
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});



//INITIALIZING STORE
//Passing initial state to the reducer is optional
const store = createStore(reducer);



//A reducer will take state object and an action to apply to it
function activeThreadIdReducer(state = '1-fca2', action) 
{
  //use the id passed from action to update the activeThreadId of the store
  if (action.type === 'OPEN_THREAD') 
  {
    return action.id;
  } 
  //return the state unmodified
  else 
  {
    return state;
  }
}

//this reducer handles all the threads and the messages within them
//messages have their own reducer
function threadsReducer(state = [
  {
    id: '1-fca2',
    title: 'Buzz Aldrin',
    messages: messagesReducer(undefined, {}),
  },
  {
    id: '2-be91',
    title: 'Michael Collins',
    messages: messagesReducer(undefined, {}),
  },
], action) 
{
  switch (action.type) 
  {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE': 
    {
      //find the index of the thread in which we have to either add or remove the message
      const threadIndex = findThreadIndex(state, action);
      const oldThread = state[threadIndex];
      
      //delegate sub-reducer for the messages property
      const newThread = {
        ...oldThread,
        messages: messagesReducer(oldThread.messages, action),
      };

      return [
        ...state.slice(0, threadIndex),
        newThread,
        ...state.slice(
          threadIndex + 1, state.length
        ),
      ];
    }
    default: {
      return state;
    }
  }
}

//nested reducer for message reducer
function messagesReducer(state = [], action) 
{
  switch (action.type) 
  {
    case 'ADD_MESSAGE': 
    {
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4(),
      };
      return state.concat(newMessage);
    }
    case 'DELETE_MESSAGE': {
      return state.filter(m => m.id !== action.id);
    }
    default: {
      return state;
    }
  }
}

//***** UI COMPONENTS *******//
class App extends React.Component 
{
  //only top most component interacts with the store
  //this is where we register our subscribe function
  componentDidMount() 
  {
    store.subscribe(() => this.forceUpdate());
  }

  render() 
  {
    //get everything from the store 
    const state = store.getState();
    
    //we need to know what's the active thread
    const activeThreadId = state.activeThreadId;
    
    //the threads
    const threads = state.threads;
    
    //the data we need to pass to threads component
    const activeThread = threads.find((t) => t.id === activeThreadId);

    //the data we need to pass to the tabs component
    const tabs = threads.map(t => (
      {
        title: t.title,
        active: t.id === activeThreadId,
        id: t.id,
      }
    ));

    return (
      <div className='ui segment'>
        <ThreadTabs tabs={tabs} />
        <Thread thread={activeThread} />
      </div>
    );
  }
}

class ThreadTabs extends React.Component 
{
  //this will dispatch an action to update the activethread id in the state
  handleClick = (id) => 
  {
    store.dispatch({
      type: 'OPEN_THREAD',
      id: id,
    });
  };

  render() {
    const tabs = this.props.tabs.map((tab, index) => (
      <div key={index} className={tab.active ? 'active item' : 'item'} onClick={() => this.handleClick(tab.id)}>
        {tab.title}
      </div>
    ));
    return (
      <div className='ui top attached tabular menu'>
        {tabs}
      </div>
    );
  }
}

class Thread extends React.Component 
{
  //this is to handle the click event
  handleClick = (id) => 
  {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: id,
    });
  };

  render() {
    const messages = this.props.thread.messages.map((message, index) => (
      <div className='comment' key={index} onClick={() => this.handleClick(message.id)}>
        <div className='text'>
          {message.text}
          <span className='metadata'>@{message.timestamp}</span>
        </div>
      </div>
    ));
    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput threadId={this.props.thread.id} />
      </div>
    );
  }
}

class MessageInput extends React.Component 
{
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value,
      threadId: this.props.threadId,
    });
    this.setState({
      value: '',
    });
  };

  render() {
    return (
      <div className='ui input'>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
      </div>
    );
  }
}

export default App;
