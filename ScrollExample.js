import React, { Component } from 'react';
import SimpleBar from 'simplebar-react';
import Scrollbar from 'react-scrollbars-custom';

import 'simplebar/dist/simplebar.min.css';
import logo from './logo.svg';
import './App.css';

const customStyle = 
{
    width: 300, 
    height: 300,
    overflowY: "auto",
    overflowX: "hidden",
};

const customStyle2 = 
{
    width: 300, 
    height: 300,
    overflow: "hidden",

};


class App extends Component {
    
      constructor(props) {
    super(props);

    this.state = {
      hovering: false
    };
  }
  
  
  render() {
          const style = {
      backgroundColor: this.state.hovering ? "red" : "blue"
    };
    
      const handleMouseEnter = () => this.setState({ hovering: true });
    const handleMouseLeave = () => this.setState({ hovering: false });
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div style={this.state.hovering ? customStyle : customStyle2} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {[...Array(100)].map((x, i) =>
            <p key={i} className="odd">Some content</p>
          )}
        </div>
      </div>
    );
  }
}

export default App;
