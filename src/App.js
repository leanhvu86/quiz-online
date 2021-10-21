import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Quiz from './components/Quiz';
import { connect } from 'react-redux';
import { ActionTypes } from './constants/actionTypes';

const mapStateToProps = state => { return { ...state.quiz } };

const mapDispatchToProps = dispatch => ({
  onQuizLoad: payload => dispatch({ type: ActionTypes.QuizLoad, payload }),
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
    quizId: 'data/lich-su.json'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  }

  componentDidMount() {
    this.load(this.state.quizId);
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
    this.setState({ quizId: e.target.value });
    this.load(e.target.value);
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
        <Quiz quiz={this.state.quiz} quizId={this.state.quizId} mode={this.state.mode} />
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
