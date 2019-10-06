import React from 'react';
import { Line } from 'progressbar.js';

import './App.scss';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            screen: 'start',
            series: [{letter: '#', pos: 4}],
            answers: [],
            scores: [],
            progressInterval: null,
            questionNo: 1,
            positionMatch: false,
            letterMatch: false,
            nBack: 1
        };

        this.testLength = 21;
        this.singleQuestionTime = 3000;
    }

    getMatchBtnClasses(questionNo, nBack, match) {
        const initialRounds = questionNo <= nBack;
        return 'matchBtn' + (initialRounds ? ' disabled' : (match ? ' active' : ''));
    }

    getRandomInt(offset, length, leaveOutNum = false) {
        return offset + Math.floor(
            leaveOutNum
                ? (leaveOutNum + 1 + (Math.random() * (length - 1))) % length
                : Math.floor(Math.random() * length)
        );
    }

    getRandomQuestion(series, nBack, questionNo) {
        const initQuestion = questionNo < nBack;
        let letter, pos;

        if (initQuestion) {
            letter = String.fromCharCode(this.getRandomInt(65, 25));
            pos = this.getRandomInt(0, 9);
        } else {
            const showLastLetter = (Math.random() * 100) < 29.3;
            const showLastPos = (Math.random() * 100) < 29.3;
            const lastLetter = showLastLetter && series.slice(-nBack)[0].letter;
            const lastPos = showLastPos && series.slice(-nBack)[0].pos;
            letter = lastLetter ? lastLetter : String.fromCharCode(this.getRandomInt(65, 25, lastLetter));
            pos = lastPos ? lastPos : this.getRandomInt(0, 9, lastPos);
        }

        return {letter, pos};
    }

    calculateScore(series, positionMatch, letterMatch) {
        const prevState = series.slice(-1 - this.state.nBack)[0];
        const currState = series.slice(-1)[0];
        const posSame = prevState.pos === currState.pos;
        const posScore = positionMatch === posSame;
        const letterSame = prevState.letter === currState.letter;
        const letterScore = letterMatch === letterSame;
        return {pos: posScore, letter: letterScore};
    }

    handleCancelBtn = () => {
        this.handleStopRound();
    }

    handleStartTouchStart = e => {
        e.target.classList.add('active');
    }

    handleLetterMatchBtn = e => {
        this.setState({letterMatch: !this.state.letterMatch});
    }

    handlePositionMatchBtn = e => {
        this.setState({positionMatch: !this.state.positionMatch});
    }

    handleItemTouchStart = e => {
        e.target.classList.add('active');
    }

    handleIncreaseNBack = e => {
        e.target.classList.remove('active');
        this.setState({nBack: Math.min(Math.floor(this.testLength / 2), this.state.nBack + 1)});
    }

    handleDecreaseNBack = e => {
        e.target.classList.remove('active');
        this.setState({nBack: Math.max(1, this.state.nBack - 1)});
    }

    handleItemTouchStart = e => {
        e.target.classList.add('active');
    }

    handleItemTouchEnd = e => {
        e.target.classList.remove('active');
    }

    handleMenuClick = e => {
        this.setState({screen: 'start'});
    }

    handleStartRound = e => {
        e.target.classList.remove('active');
        const progressIntervalFn = () => {
            this.handleRoundChange();
        };

        this.setState({screen: 'test', questionNo: 1, series: [this.getRandomQuestion([], this.state.nBack, 0)], answers: [], scores: [], progressInterval: setInterval(progressIntervalFn, this.singleQuestionTime)}, () => {
            this.progress = new Line('.progressBar', {
                duration: this.singleQuestionTime,
                color: '#2545a8'
            });
            this.progress.animate(1);
        });
    }

    handleRoundChange = () => {
        if (this.state.questionNo >= this.testLength) {
            this.handleStopRound();
            return;
        }

        this.progress.set(0);
        this.progress.animate(1);

        const newScore = this.state.questionNo <= this.state.nBack
            ? {}
            : this.calculateScore(this.state.series, this.state.positionMatch, this.state.letterMatch);
        const newScores = this.state.scores.concat(newScore);

        const newSeries = this.state.series.concat(this.getRandomQuestion(this.state.series, this.state.nBack, this.state.questionNo));
        const newAnswers = this.state.answers.concat({letter: this.state.letterMatch, pos: this.state.positionMatch});

        this.setState({series: newSeries, questionNo: this.state.questionNo + 1, positionMatch: false, letterMatch: false, answers: newAnswers, scores: newScores});
    }

    handleStopRound = () => {
        const newScore = this.calculateScore(this.state.series, this.state.positionMatch, this.state.letterMatch);

        const newScores = this.state.scores.concat(newScore);

        clearInterval(this.state.progressInterval);
        this.setState({screen: 'stats', progressInterval: null, scores: newScores});
    }

    renderBoard() {
        return(
            <div className="board">
                { 
                    [...Array(9)].map((cell, index) => {
                        const shouldShow = index === this.state.series.slice(-1)[0].pos; 
                        const letterClasses = 'displayLetter' + (shouldShow ? ' show' : '');
                        return (
                            <div className={'cell' + (shouldShow ? ' active' : '')} key={index}>
                                <span className={letterClasses}>
                                    { this.state.series.slice(-1)[0].letter }
                                </span>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    renderStartScreen() {
        const decreaseClasses = 'menuItem' + (this.state.nBack === 1 ? ' disabled' : '');
        const increaseClasses = 'menuItem' + (this.state.nBack >= Math.round(this.testLength / 2) ? ' disabled' : '');
        return (
            <div className="homeScreen">
                <div className="header">
                    <h1>Dual N-Back</h1>
                </div>
                <div className="menuItems">
                    <div className="menuItem">How to play</div>
                    <div className="menuItem">Options</div>
                    <div className="menuItem">Statistics</div>
                    <div className="modeSelector">
                        <div className={decreaseClasses} onTouchStart={this.handleItemTouchStart} onTouchEnd={this.handleDecreaseNBack}><i className="fas fa-caret-left"></i></div>
                        <div className="menuItem">{ this.state.nBack } Back</div>
                        <div className={increaseClasses} onTouchStart={this.handleItemTouchStart} onTouchEnd={this.handleIncreaseNBack}><i className="fas fa-caret-right"></i></div>
                    </div>
                    <div className="startBtn" onTouchStart={this.handleStartTouchStart} onTouchEnd={this.handleStartRound}>Start</div>
                </div>
            </div>
        );
    }

    renderTestScreen() {
        const letterMatchClasses = this.getMatchBtnClasses(this.state.questionNo, this.state.nBack, this.state.letterMatch);
        const positionMatchClasses = this.getMatchBtnClasses(this.state.questionNo, this.state.nBack, this.state.positionMatch);
        return (
            <div className="gameScreen">
                <div className="gameHeader">
                    <div className="title">Dual {this.state.nBack} Back</div>
                    <button className="cancelBtn" onClick={this.handleCancelBtn}>Cancel</button>
                </div>
                <div className="boardContainer">
                    { this.renderBoard() }
                </div>
                <div className="progressBarHolder">
                    <div className="progressBar"></div>
                </div>
                <div className="btnRow">
                    <div className={letterMatchClasses} onTouchStart={this.handleLetterMatchBtn}>Letter match</div>
                    <div className={positionMatchClasses} onTouchStart={this.handlePositionMatchBtn}>Position match</div>
                </div>
                <div className="pager"> <span className="number">{this.state.questionNo}</span> <span className="separator">/</span> <span className="number">{this.testLength}</span> </div>
            </div>
        );
    }

    renderStatsScreen() {
        const posScores = this.state.scores.slice(1, -1).reduce((acc, curr) => curr.pos ? acc + 1 : acc, 0);
        const letterScores = this.state.scores.slice(1, -1).reduce((acc, curr) => curr.letter ? acc + 1 : acc, 0);
        const combinedScores = this.state.scores.slice(1, -1).reduce((acc, curr) => curr.letter && curr.pos ? acc + 1 : acc, 0);
        return (
            <div className="statsScreen">
                <h2>Game info:</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>N-Back</th>
                            <td>{this.state.nBack}</td>
                        </tr>
                        <tr>
                            <th>Rounds completed</th>
                            <td>{this.state.questionNo - 1}</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Success rates:</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Position matched</th>
                            <td>{Math.round((posScores / (this.state.questionNo - 2)) * 100)}%</td>
                        </tr>
                        <tr>
                            <th>Letter matched</th>
                            <td>{Math.round((letterScores / (this.state.questionNo - 2)) * 100)}%</td>
                        </tr>
                        <tr>
                            <th>Both matched</th>
                            <td>{Math.round((combinedScores / (this.state.questionNo - 2)) * 100)}%</td>
                        </tr>
                    </tbody>
                </table>
                <div className="backHomeBtn" onClick={this.handleMenuClick}>Main menu</div>
                <div className="retryBtn" onClick={this.handleStartRound}>Retry</div>
            </div>
        );
    }

    renderScreen() {
        if (this.state.screen === 'test') {
            return this.renderTestScreen();
        } else if (this.state.screen === 'stats') {
            return this.renderStatsScreen();
        }
        return this.renderStartScreen();
    }

    render() {
        return (
            <div className="App">
                { this.renderScreen() }
            </div>
        );
    }
}

export default App;
