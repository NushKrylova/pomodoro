import React from 'react';
import './App.css';

const SESSION = "Session"
const BREAK = "Break"
const SESSION_LENGTH = "sessionLength"
const BREAK_LENGTH = "breakLength"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerLabel: SESSION,
      minutes: 0,
      seconds: 0,
      running: false,
      intervalId: ""
    };
  }
  componentDidMount() {
    this.setState((state) => {
      return {
        minutes: state.sessionLength
      }
    })
  }
  convertToTimeFormat(minutes, seconds) {
    let sec;
    seconds < 10 ? sec = "0" + seconds : sec = seconds
    let min;
    minutes < 10 ? min = "0" + minutes : min = minutes
    return min + ":" + sec
  }
  reset() {
    this.clearInterval(this.state.intervalId)
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerLabel: SESSION,
      minutes: 25,
      seconds: 0,
    })
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
  decrement(value) {
    switch (value) {
      case BREAK_LENGTH:
        if (this.state.breakLength === 1) {
          return
        }
        this.setState((state) => {
          return {
            breakLength: state.breakLength - 1
          }
        });
        break;
      case SESSION_LENGTH:
        if (this.state.sessionLength === 1) {
          return
        }
        this.setState((state) => {
          return {
            sessionLength: state.sessionLength - 1,
            minutes: state.sessionLength - 1,
          }
        })
        break;
    }

  }
  increment(value) {
    switch (value) {
      case BREAK_LENGTH:
        if (this.state.breakLength === 60) {
          return
        }
        this.setState((state) => {
          return {
            breakLength: state.breakLength + 1
          }
        })
        break
      case SESSION_LENGTH:
        if (this.state.sessionLength === 60) {
          return
        }
        this.setState((state) => {
          return {
            sessionLength: state.sessionLength + 1,
            minutes: state.sessionLength + 1,
          }
        })
        break
    }
  }
  clearInterval() {
    clearInterval(this.state.intervalId);
    this.setState({
      intervalId: "",
      running: false
    })
  }

  startStop() {
    if (this.state.running) {
      this.clearInterval(this.state.intervalId)
    } else {
      let intervalId = setInterval(() => this.countDown(), 1000);
      this.setState((state) => {
        return {
          intervalId: intervalId,
          running: true,
          // minutes:0,
          // seconds:5
        }
      })
    }
  }
  switchTimer() {
    if (this.state.timerLabel === SESSION) {
      this.setState((state) => {
        return {
          timerLabel: BREAK,
          minutes: state.breakLength,
        }
      })
    } else {
      this.setState((state) => {
        return {
          timerLabel: SESSION,
          minutes: state.sessionLength,
        }
      })
    }
  }
  countDown() {
    //play sound, start at 00:01
    if (this.state.minutes === 0 && this.state.seconds === 1) {
      this.playSound()
    }
    //handle 00:00
    if (this.state.minutes === 0 && this.state.seconds === 0) {
      this.clearInterval(this.state.intervalId)
      this.switchTimer()
      this.startStop()
      return
    }
    //handle -1s
    if (this.state.seconds === 0) {
      this.setState((state) => {
        return {
          minutes: state.minutes - 1,
          seconds: 59,
        }
      })
    } else {
      this.setState((state) => {
        return {
          seconds: state.seconds - 1,
        }
      })
    }
  }
  playSound() {
    this.audioBeep.currentTime = 0;
    this.audioBeep.play();

  }
  render() {
    return (
      <div id="pomodoro" className="title">Pomodoro Clock
        <div className="container">
          <div className="length">
            <div className="length-block">
              <div id="break-label" className="text">Break Length</div>
              <div className="buttons">
                <button id="break-decrement" className="arrow-button" onClick={this.decrement.bind(this, BREAK_LENGTH)}>
                  <i className="fa fa-arrow-down fa-2x"></i>
                </button>
                <div id="break-length" className="text">{this.state.breakLength}</div>
                <button id="break-increment" className="arrow-button" onClick={this.increment.bind(this, BREAK_LENGTH)}>
                  <i className="fa fa-arrow-up fa-2x"></i>
                </button>
              </div>
            </div>
            <div className="length-block">
              <div id="session-label" className="text">Session Length</div>
              <div className="buttons">
                <button id="session-decrement" className="arrow-button" onClick={this.decrement.bind(this, SESSION_LENGTH)}>
                  <i className="fa fa-arrow-down fa-2x"></i>
                </button>
                <div id="session-length" className="text">{this.state.sessionLength}</div>
                <button id="session-increment" className="arrow-button" onClick={this.increment.bind(this, SESSION_LENGTH)}>
                  <i className="fa fa-arrow-up fa-2x"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="session">
            <div id="timer-label">{this.state.timerLabel}</div>
            <div id="time-left">{this.convertToTimeFormat(this.state.minutes, this.state.seconds)}</div>
          </div>
          <div className="control-buttons buttons">
            <button id="start_stop" className="arrow-button" onClick={this.startStop.bind(this)}>
              <i className="fa fa-play fa-2x"></i>
              <i className="fa fa-pause fa-2x"></i>
            </button>
            <button id="reset" className="arrow-button" onClick={this.reset.bind(this)}>
              <i className="fa fa-refresh fa-2x"></i>
            </button>
          </div>
          <audio id="beep" src="https://goo.gl/65cBl1" ref={(audio) => { this.audioBeep = audio; }} ></audio>
        </div>
      </div >
    );
  }
}
export default App;

