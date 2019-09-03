import React from 'react';
import uuid from 'uuid';
import { createStore } from 'redux';

//Initial state object
const initialState = {
    activeThreadId: '1',
    threads: [{
            id: '1',
            title: 'Thread 1',
            messages: [{
                text: 'Message 1 - Thread 1',
                timestamp: Date.now(),
                id: uuid.v4(),
            }, 
            {
                text: 'Message 2 - Thread 1',
                timestamp: Date.now(),
                id: uuid.v4(),
            },
            {
                text: 'Message 3 - Thread 1',
                timestamp: Date.now(),
                id: uuid.v4(),
            }],
        },
        {
            id: '2',
            title: 'Thread 2',
            messages: [{
                text: 'Message 1 - Thread 2',
                timestamp: Date.now(),
                id: uuid.v4(),                
            },
            {
                text: 'Message 2 - Thread 2',
                timestamp: Date.now(),
                id: uuid.v4(),                
            },
            {
                text: 'Message 3 - Thread 2',
                timestamp: Date.now(),
                id: uuid.v4(),                
            },
            ],
        },
        {
            id: '3',
            title: 'Thread 3',
            messages: [{
                text: 'Message 1 - Thread 3',
                timestamp: Date.now(),
                id: uuid.v4(),                
            },
            {
                text: 'Message 2 - Thread 3',
                timestamp: Date.now(),
                id: uuid.v4(),                
            },
            {
                text: 'Message 3 - Thread 3',
                timestamp: Date.now(),
                id: uuid.v4(),                
            },
            ],
        }
    ],
};

//create store
const store = createStore(reducer, initialState);

//*** REDUCER FUNCTION ***//
//ARGUMENTS: current state, and the action to apply to the state
//RETURN: new state object
function reducer(state, action) {
    //our message input component will use this to add messages to the store
    if (action.type === 'ADD_MESSAGE') {
        const newMessage = {
            text: action.text,
            timestamp: Date.now(),
            id: uuid.v4(),
        };
        
        //which thread was active when the action was sent?
        //iterate over all the threads in the state and find the one
        //with the matching active ID 
        const threadIndex = state.threads.findIndex(
            (t) => t.id === action.threadId
        );
        
        //update the old tread with the new message
        const oldThread = state.threads[threadIndex];
        const newThread = {
            ...oldThread,
            messages: oldThread.messages.concat(newMessage),
        };

        return {
            ...state,
            threads: [
                ...state.threads.slice(0, threadIndex),
                newThread,
                ...state.threads.slice(
                    threadIndex + 1, state.threads.length
                ),
            ],
        };
    } 
    
    
    //our thread component will use this to remove a message that
    //was click on.
    else if (action.type === 'DELETE_MESSAGE') {
        //find the index of the thread which generated the action
        //search all messages of all threads
        const threadIndex = state.threads.findIndex(
            (t) => t.messages.find((m) => (
                m.id === action.id
            ))
        );
        
        //get the old thread and remove the message from it
        const oldThread = state.threads[threadIndex];
        const newThread = {
            ...oldThread,
            messages: oldThread.messages.filter((m) => (
                m.id !== action.id
            )),
        };

        return {
            ...state,
            threads: [
                ...state.threads.slice(0, threadIndex),
                newThread,
                ...state.threads.slice(
                    threadIndex + 1, state.threads.length
                ),
            ],
        };
    } 
    //switch between threads
    else if (action.type === 'OPEN_THREAD') {
        //keep everything in the state as is
        //and only update the action.id
        return {
            ...state,
            activeThreadId: action.id,
        };
    } else {
        return state;
    }
}


class App extends React.Component {
    
    //every time the store updates, it will cause the subscribe 
    //function to be call, and thereafter all the child components will get
    //the updated components
    componentDidMount() {
        store.subscribe(() => this.forceUpdate());
    }


    //only the top most component deals with the store
    render() {
        const state = store.getState();
        const activeThreadId = state.activeThreadId;
        const threads = state.threads;
        const activeThread = threads.find((t) => t.id === activeThreadId);

        //all the information we need to render the tabs on the top
        const tabs = threads.map(t => ({
            title: t.title,
            active: t.id === activeThreadId,
            id: t.id,
        }));


        return (
        <div className = 'ui segment' >
            <ThreadTabs tabs = {tabs}/> 
            <Thread thread = {activeThread}/>
        </div>
        );
    }
}

class ThreadTabs extends React.Component {
    handleClick = (id) => {
        store.dispatch({
            type: 'OPEN_THREAD',
            id: id,
        });
    };

    render() {
        const tabs = this.props.tabs.map((tab, index) => ( 
        <div key = {index} className = {tab.active ? 'active item' : 'item'} onClick = {() => this.handleClick(tab.id)} >
          {tab.title} 
        </div>
        ));
        return ( 
        <div className = 'ui top attached tabular menu' > 
          {tabs} 
        </div>
        );
    }
}

class MessageInput extends React.Component {
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
        <div className = 'ui input' >
            <input onChange = {this.onChange} value = {this.state.value} type = 'text' />
            <button onClick = {this.handleSubmit} className = 'ui primary button' type = 'submit' >Submit</button> 
        </div>
        );
    }
}

class Thread extends React.Component {
    handleClick = (id) => {
        store.dispatch({
            type: 'DELETE_MESSAGE',
            id: id,
        });
    };

    render() {
        const messages = this.props.thread.messages.map((message, index) => ( 
        <div className = 'comment' key = {index} onClick = {() => this.handleClick(message.id)} >
            <div className = 'text' > 
              {message.text} 
              <span className = 'metadata' > @ {message.timestamp} < /span> </div> 
            </div>
        ));
        return (
        <div className = 'ui center aligned basic segment' >
            <div className = 'ui comments' > 
              {messages} 
            </div> 
            <MessageInput threadId = {this.props.thread.id}/> 
        </div>
        );
    }
}

export default App;