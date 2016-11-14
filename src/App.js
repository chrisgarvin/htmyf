import React from 'react';
import './App.css';
import { randomFeeling } from './client.js'
import { postMessage, getMessage, getStats } from './api_calls.js'
var $ = require ('jquery')

const AppDashboard = React.createClass({
  getInitialState: function() {
    return {
        stats: {reactions: {}, current: {}},
        upperFeelings: [],
        upperChoice: null,
        lowerChoice: null,
        lowerFeelings: [],
        currentMessage: "",
        upperDisabled: false,
        lowerDisabled: true
    };
  },
  handleClick: function(feeling, message) {
    if(!this.state.upperDisabled){
      this.setState({
        upperDisabled: true,
        lowerDisabled: false,
        upperChoice: feeling
      })
    } else {
      postMessage(message, this.state.upperChoice, feeling);
      this.setState({
        lowerDisabled: true,
        lowerChoice: feeling
      })
    }
  },
  componentDidMount: function () {
    this.updateState()
    setInterval(this.updateState, 10000)
  },
  updateState: function () {
    var self = this;
    getMessage()
    .then(function(message) {
      self.setState({currentMessage: message})
    })
    getStats()
    .then(function(stats) {
      self.setState({stats: stats})
    })
    const Feelings = []
    for(var i = 0; i < 36; i++){
      Feelings.push(randomFeeling())
    }
    if(!this.state.upperDisabled){
      this.setState({upperFeelings: Feelings, lowerFeelings: Feelings})
    } else if(!this.state.lowerDisabled){
      this.setState({lowerFeelings: Feelings})
    }
  },
  render: function() {
    return (
      <div className="App container-fluid">
        <StatList
          data={this.state.stats["reactions"]}
          type="Reaction"/>
        <FeelingButtonList
          onButtonClick={this.handleClick}
          btnClass={"btn btn-info btns"}
          feelings={this.state.upperFeelings}
          buttonStatus={this.state.upperDisabled}/>
        <Header feelingSelected={this.state.upperDisabled}/>
        <MessageDashboard
          feelingSelected={this.state.upperDisabled}
          currentMessage={this.state.currentMessage}/>
        <FeelingButtonList
          onButtonClick={this.handleClick}
          btnClass={"btn btn-warning btns"}
          feelings={this.state.lowerFeelings}
          buttonStatus={this.state.lowerDisabled}/>
        <StatList
          data={this.state.stats["current"]}
          type="Current"/>
      </div>
    )
  }
})

const StatList = React.createClass({
  render: function() {
    const stats = Object.keys(this.props.data).map((key, i) => (
      <span className="stat"
            key={"data-" + i}>
        {key} : {this.props.data[key]}
      </span>
    ))
    if(this.props.type === "Reaction"){
      return (
        <div> {stats} </div>
      )
    } else {
      return (
        <div> {stats} </div>
      )
    }
  }
})

const MessageDashboard = React.createClass({
    render: function() {
      if(this.props.feelingSelected){
        return (
            <div className='form-group'>
              <textarea className="form-control" rows="5" id="feelingBox">
              </textarea>
            </div>
        );
      } else {
        return (
            <div className='col-md-12'>
              <h1>{this.props.currentMessage}</h1>
            </div>
        )
      }
    }
});

const Header = React.createClass({
    render: function() {
        const headerText = this.props.feelingSelected
            ? "write anything... how does this make you feel?"
            : "how'd that make you feel?";
        return (
            <div className='header-text'>
              <h1>{headerText}</h1>
            </div>
        );
    }
});

const FeelingButtonList = React.createClass({
    render: function() {
      const feelingButtons = this.props.feelings.map((feeling, i) => (
        <FeelingButton
          onButtonClick={this.props.onButtonClick}
          btnClass={this.props.btnClass}
          key={'feeling-' + i}
          feeling={feeling}
          buttonStatus={this.props.buttonStatus}/>
        )
      );
        return (
            <div id='feeling-buttons col-md-12'>
              {feelingButtons}
            </div>
        );
    }
});

const FeelingButton = React.createClass({
    getInitialState: function() {
      return {
        btnClass: this.props.btnClass
      };
    },
    handleClick: function() {
      if(typeof $('#feelingBox')[0] === 'undefined'){
        this.props.onButtonClick(this.props.feeling, "")
      } else {
        var message = $('#feelingBox')[0].value;
        this.props.onButtonClick(this.props.feeling, message)
      }
        this.setState({btnClass: "btn btn-success btns"})
    },
    render: function() {
        return (
            <div className='feeling-button col-md-1'>
              <button
                disabled={this.props.buttonStatus}
                onClick={this.handleClick}
                className={this.state.btnClass}
                type="submit">
                {this.props.feeling}
              </button>
            </div>
        );
    }
});

export default AppDashboard;
