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
            progress: false
        };
    }

    handleCancelBtn = () => {
        clearInterval(this.state.roundInterval);
        this.setState({inTestMode: false, roundInterval: null});
    }

    handleStartBtn = () => {
        this.setState({progress: true, inTestMode: true, roundInterval: setInterval(this.handleRoundChange, 3000)});
    }

    handleRoundChange = () => {
        const newLetter = String.fromCharCode(65 + Math.floor(Math.random() * 25));
        const newPos = Math.floor(Math.random() * 9);
        this.setState({letter: newLetter, pos: newPos, progress: true}, () => {
            setTimeout(() => {
                this.setState({progress: false});
            }, 2900);
        });
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
                    <div className={'progress' + (this.state.progress ? ' loaded' : '')}></div>
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
