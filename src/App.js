import React from 'react';
import './App.scss';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            inTestMode: false,
            pos: 3,
            letter: 'A',
            roundInterval: null,
            progressInterval: null,
            progress: 0
        };
    }

    handleCancelBtn = () => {
        clearInterval(this.state.progressInterval);
        this.setState({inTestMode: false, roundInterval: null});
    }

    handleStartBtn = () => {
        const progressIntervalFn = () => {
            if (this.state.progress >= 0.9) {
                this.setState({progress: 0});
                this.handleRoundChange();
            } else {
                this.setState({progress: this.state.progress + 0.1});
                console.log(this.state.progress);
            }
        };
        this.setState({progress: true, inTestMode: true, progressInterval: setInterval(progressIntervalFn, 300)});
    }

    handleRoundChange = () => {
        const newLetter = String.fromCharCode(65 + Math.floor(Math.random() * 25));
        const newPos = Math.floor(Math.random() * 9);
        this.setState({letter: newLetter, pos: newPos});
    }

    renderBoard() {
        return(
            <div className="board">
                { 
                    [...Array(9)].map((cell, index) => {
                        return (
                            <div className="cell" key={index}>
                                { index === this.state.pos
                                    && this.state.letter }
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    renderHomeScreen() {
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
                <div className="pager"> 13/24 </div>
            </div>
        );
    }

    render() {
        return (
            <div className="App">
                { this.state.inTestMode
                    ? this.renderTestScreen()
                    : this.renderHomeScreen()
                }
            </div>
        );
    }
}

export default App;
