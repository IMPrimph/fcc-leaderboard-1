import React, { Component } from 'react';
import { sortBy } from 'lodash';
import './App.css';

const API_URL = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";

// sorting functionality based on Road to Learn React course by Robin Wieruch
// https://www.educative.io/collection/5740745361195008/5676830073815040?authorName=Robin%20Wieruch

const SORTS = {
  NONE: list => list,
  RECENT: list => sortBy(list, 'recent').reverse(),
  USERNAME: list => sortBy(list, 'username'),
  ALLTIME: list => sortBy(list, 'alltime').reverse(),
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
    };

    this.getLeaders = this.getLeaders.bind(this);
  }

  getLeaders() {
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        this.setState({
          results: result
        });
      });
  }

  componentDidMount() {
    this.getLeaders();
  }

  render() {
    const {
      results
    } = this.state;

    return (
      <div>
        <LeaderBoard leaders={results} />
      </div>
    );
  }
}

const Sort = ({whichSort, thisSort, isReverse, onSort, children}) => {
  // Sort will determine if it is the current active sort method,
  // and if so, in what direction the list is being sorted

  const whichClass = (whichSort === thisSort) ? 'activeSort' : ''
  const icon = isReverse ? 'fa-arrow-down' : 'fa-arrow-up'

  return (
    <button
      className={`btn ${whichClass}`}
      onClick={() => onSort(thisSort)}
    >
      {children}
      {(whichSort === thisSort) ? <i className={`fa ${icon}`} aria-hidden="true"></i> : null}
    </button>
  );
}


class LeaderBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      whichSort: 'NONE',
      reverseSort: false,
    }

    this.onSort = this.onSort.bind(this);
  }

  onSort(whichSort) {
    // only toggle reverseSort while the same sort method is being used
    const reverseSort = this.state.whichSort === whichSort ? !this.state.reverseSort : false
    this.setState({
      whichSort,
      reverseSort
    });
  }

  render() {
    const {
      leaders
    } = this.props;

    const {
      whichSort,
      reverseSort
    } = this.state;

    // leaders (and in turn sortedLeaders, reverseLeaders) will be null when LeaderBoard first renders
    // the Sort doesn't mind this, but reverse() and map() will
    const sortedLeaders = SORTS[whichSort](leaders)
    const reverseLeaders = (sortedLeaders && reverseSort) ? sortedLeaders.reverse() : sortedLeaders

    return (
      <div>
        <div className="leaderHeader leaderRow">
          <div className="avatar">
            <div>&nbsp;</div>
          </div>
          <div className="points">
            <Sort
              whichSort={whichSort}
              thisSort='RECENT'
              isReverse={reverseSort}
              onSort={this.onSort}
            >
              Recent
            </Sort>
          </div>
          <div className="user">
            <Sort
              whichSort={whichSort}
              thisSort='USERNAME'
              isReverse={reverseSort}
              onSort={this.onSort}
            >
              Username
            </Sort>
          </div>
          <div className="points">
            <Sort
              whichSort={whichSort}
              thisSort='ALLTIME'
              isReverse={reverseSort}
              onSort={this.onSort}
            >
              All time
            </Sort>
          </div>
        </div>
        {reverseLeaders && reverseLeaders.map(leader =>
          <div key={leader.username} className="leaderRow">
            <div className="avatar">
              <img src={leader.img} alt={`${leader.username}'s avatar`} />
            </div>
            <div className="points">
              {leader.recent}
            </div>
            <div className="user">
              <a href={`https://www.freecodecamp.com/${leader.username}`} target="_blank">
                {leader.username}
              </a>
            </div>
            <div className="points">
              {leader.alltime}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
