import React from 'react';
import './App.scss';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            screen: 'start',
            series: [],
            answers: [],
            progressInterval: null,
            progress: 0,
            questionNo: 1,
            positionMatch: false,
            letterMatch: false,
            nBack: 1
        };

        this.testLength = 6;
    }

    handleCancelBtn = () => {
        this.handleStopRound();
    }

    handleStartBtn = () => {
        const progressIntervalFn = () => {
            if (this.state.progress >= 0.9) {
                this.setState({progress: 0});
                this.handleRoundChange();
            } else {
                this.setState({progress: this.state.progress + 0.1});
            }
        };

        const startLetter = String.fromCharCode(65 + Math.floor(Math.random() * 25));
        const startPos = Math.floor(Math.random() * 9);

        this.setState({screen: 'test', questionNo: 1, series: [{letter: startLetter, pos: startPos}], answers: []}, () => {
            setTimeout(() => {
                this.setState({progressInterval: setInterval(progressIntervalFn, 300)});
            }, 50);
        });
    }

    handleLetterMatchBtn = e => {
        this.setState({letterMatch: !this.state.letterMatch});
    }

    handlePositionMatchBtn = e => {
        this.setState({positionMatch: !this.state.positionMatch});
    }

    handleIncreaseNBack = e => {
        this.setState({nBack: Math.min(Math.floor(this.testLength / 2), this.state.nBack + 1)});
    }

    handleDecreaseNBack = e => {
        this.setState({nBack: Math.max(1, this.state.nBack - 1)});
    }

    handleRoundChange = () => {
        if (this.state.questionNo >= this.testLength) {
            this.handleStopRound();
            return;
        }
        const newLetter = String.fromCharCode(65 + Math.floor(Math.random() * 25));
        const newPos = Math.floor(Math.random() * 9);

        const newSeries = this.state.series.concat({letter: newLetter, pos: newPos});
        const newAnswers = this.state.answers.concat({letter: this.state.letterMatch, pos: this.state.positionMatch});

        this.setState({series: newSeries, questionNo: this.state.questionNo + 1, positionMatch: false, letterMatch: false, answers: newAnswers});
    }

    handleStopRound = () => {
        clearInterval(this.state.progressInterval);
        this.setState({screen: 'stats', progressInterval: null, progress: 0});
    }

    renderBoard() {
        return(
            <div className="board">
                { 
                    [...Array(9)].map((cell, index) => {
                        const shouldShow = index === this.state.series.slice(-1)[0].pos; 
                        const letterClasses = 'displayLetter' + (shouldShow ? ' show' : '');
                        const letterStyle = {opacity: shouldShow ? '1' : '0'};
                        return (
                            <div className="cell" key={index}>
                                <span className={letterClasses} style={letterStyle}>
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
        return (
            <div className="homeScreen">
                <div className="startBtn" onClick={this.handleStartBtn}>Start</div>
                <div className="modeSelector">
                    <div className="menuItem" onTouchStart={this.handleDecreaseNBack}><i className="fas fa-caret-left"></i></div>
                    <div className="menuItem nBack">{ this.state.nBack } Back</div>
                    <div className="menuItem rightBtn" onTouchStart={this.handleIncreaseNBack}><i className="fas fa-caret-right"></i></div>
                </div>
                <div className="menuItem">How to play</div>
                <div className="menuItem">About</div>
            </div>
        );
    }

    renderTestScreen() {
        const letterMatchClasses = 'matchBtn' + (this.state.letterMatch ? ' active' : '');
        const positionMatchClasses = 'matchBtn' + (this.state.positionMatch ? ' active' : '');
        return (
            <div className="testScreen">
                <div className="counter">
                    <div className="title">Dual 2 Back</div>
                    <button className="cancelBtn" onClick={this.handleCancelBtn}>Cancel</button>
                </div>
                { this.renderBoard() }
                <div className="btnRow">
                    <div className={letterMatchClasses} onTouchStart={this.handleLetterMatchBtn}>Letter match</div>
                    <div className={positionMatchClasses} onTouchStart={this.handlePositionMatchBtn}>Position match</div>
                </div>
                <div className="progressBarHolder">
                    <div className={"progress" + (this.state.progress < 1 && this.state.progress > 0 ? " loading" : "")} style={{width: 'calc((84vw + 24px) * ' + this.state.progress + ')'}}></div>
                </div>
                <div className="pager"> {this.state.questionNo + '/' + this.testLength} </div>
            </div>
        );
    }

    renderStatsScreen() {
        return (
            <div className="statsScreen">
                <h1>Series:</h1>
                <div>{ JSON.stringify(this.state.series) }</div>
                <h1>Answers:</h1>
                <div>{ JSON.stringify(this.state.answers) }</div>
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
