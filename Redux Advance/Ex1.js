import React from 'react';
import {createStore} from 'redux';
import uuid from 'uuid';

function reducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    const newMessage = {
		text: action.text,
		timestamp: Date.now(),
		id: uuid.v4(),
	};
	return {
		messages: state.messages.concat(newMessage),
	};
  } else if (action.type === 'DELETE_MESSAGE') {
    return {
		messages: state.messages.filter((x) => x.id !== action.id)
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };

const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
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

class MessageView extends React.Component {
  handleClick = (x) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: x,
    });
  };

  render() {
    const messages = this.props.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(message.id)}
      >
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
      </div>
    );
  }
}

export default App;
