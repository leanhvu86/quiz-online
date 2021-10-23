import React, {Component} from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Quiz from './components/Quiz';
import {connect} from 'react-redux';
import {ActionTypes} from './constants/actionTypes';

const mapStateToProps = state => { return { ...state.quiz } };

const mapDispatchToProps = dispatch => ({
  onQuizLoad: payload => dispatch({ type: ActionTypes.QuizLoad, payload }),
  onSubmit: payload => dispatch({ type: ActionTypes.QuizSubmit, payload }),
  onPagerUpdate: payload => dispatch({ type: ActionTypes.PagerUpdate, payload })
});

class App extends Component {
  state = {
    quizes: [
      // { id: 'data/javascript.json', name: 'Javascript' },
      // { id: 'data/pmone.json', name: 'PM one' },
      // { id: 'data/aspnet.json', name: 'Asp.Net' },
      { id: 'data/lich-su.json', name: 'Lịch sử' },
      { id: 'data/de-dia.json', name: 'Địa lý' },
      { id: 'data/cong-nghe.json', name: 'Công nghệ' }
    ],
    quizId: 'data/lich-su.json',
    time: {},
    seconds:1800,
    stop:false
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  }

  componentDidMount() {
    this.load(this.state.quizId);
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    this.startTimer();
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.startTimer();
  }
  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }
  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
      this.props.onSubmit();
      alert('Đã hết thời gian');
    }
  }

  load(quizId) {
    let url = quizId || this.props.quizId;
    fetch(`../${url}`).then(res => res.json()).then(res => {
      let quiz = res;
      quiz.questions.forEach(q => {
        q.options.forEach(o => o.selected = false);
      });
      quiz.config = Object.assign(this.props.quiz.config || {}, quiz.config);
      this.pager.count = quiz.questions.length / this.pager.size;
      this.props.onQuizLoad(quiz);
      this.props.onPagerUpdate(this.pager);
    });
  }

  onChange = (e) => {
    this.setState({ quizId: e.target.value ,seconds:1800});
    this.load(e.target.value);
    this.startTimer();
  }

  render() {
    return (
      <div className="container">
        <header className="p-2">
          <div className="row">
            <div className="col-6">
              <h3>Quiz Kỳ I</h3>
            </div>
            <div className="col-6 text-right">
              <label className="mr-1">Vui lòng chọn đề:</label>
              <select onChange={this.onChange}>
                {this.state.quizes.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
              </select>
            </div>
          </div>
        </header>
        <Quiz quiz={this.state.quiz} quizId={this.state.quizId} mode={this.state.mode} stop={this.state.stop} />
        <br/>
        <div className="row">
          <div className="col-8">

          </div>
          <div className="col-4">
            <div style={{float:'right',color:'red'}}>
              {/*<button onClick={this.startTimer}>Start</button>*/}
              <h5>{this.state.time.m} phút {this.state.time.s} giây </h5>
            </div>
          </div>
        </div>
        <footer>
          <br/>
          <div className="row">
            <div className="col-6">
              <h3>Quiz Kỳ I</h3>
            </div>
            <div className="col-6 text-right">
              <label className="mr-1">Vui lòng chọn đề:</label>
              <select onChange={this.onChange}>
                {this.state.quizes.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
              </select>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
