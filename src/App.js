import React from 'react';
import './App.scss';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            screen: 'start',
            series: [],
            progressInterval: null,
            progress: 0,
            questionNo: 1
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

        this.setState({screen: 'test', questionNo: 1, series: [{letter: startLetter, pos: startPos}]}, () => {
            setTimeout(() => {
                this.setState({progressInterval: setInterval(progressIntervalFn, 300)});
            }, 50);
        });
    }

    handleRoundChange = () => {
        if (this.state.questionNo >= this.testLength) {
            this.handleStopRound();
            return;
        }
        const newLetter = String.fromCharCode(65 + Math.floor(Math.random() * 25));
        const newPos = Math.floor(Math.random() * 9);
        const newSeries = this.state.series.concat({letter: newLetter, pos: newPos});
        this.setState({series: newSeries, questionNo: this.state.questionNo + 1});
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
            </div>
        );
    }

    renderTestScreen() {
        return (
            <div className="testScreen">
                <div className="counter">
                    <div className="title">Dual 2 Back</div>
                    <button className="cancelBtn" onClick={this.handleCancelBtn}>Cancel</button>
                </div>
                { this.renderBoard() }
                <div className="btnRow">
                    <div className="matchBtn">Letter match</div>
                    <div className="matchBtn selected">Position match</div>
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
            <div className="homeScreen">
                <div>Stats screen</div>
                <div>{ JSON.stringify(this.state.series) }</div>
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
