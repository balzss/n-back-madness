import React from 'react';
import { connect } from 'react-redux';
import { setViewState, VIEW_STATES } from '../actions';
import { Line } from 'progressbar.js';

const mapStateToProps = state => ({
    viewState: state.viewState,
    nBack: state.gameOptions.nBack,
    totalRounds: state.gameOptions.totalRounds,
    singleQuestionTime: state.gameOptions.singleQuestionTime
});

class GameView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentRound: 1,
            questionBuffer: [{letter: '#', pos: 4}],
            answers: [],
            scores: [],
            progressInterval: null,
            positionMatch: false,
            letterMatch: false,
        };
    }

    componentDidMount() {
        this.startRound();
    }

    startRound = () => {
        const progressIntervalFn = () => {
            this.handleRoundChange();
        };

        this.setState({questionBuffer: [this.getRandomQuestion()], progressInterval: setInterval(progressIntervalFn, this.props.singleQuestionTime)}, () => {
            this.progress = new Line('.progressBar', {
                duration: this.props.singleQuestionTime,
                color: '#2545a8'
            });
            this.progress.animate(1);
        });
    }

    handleRoundChange = () => {
        if (this.state.currentRound >= this.props.totalRounds) {
            this.handleStopRound();
            return;
        }

        this.progress.set(0);
        this.progress.animate(1);

        const inInitRounds = this.state.currentRound <= this.props.nBack;

        const newScore = !inInitRounds
            && this.calculateScore(this.state.questionBuffer, this.state.positionMatch, this.state.letterMatch);
        const newScores = this.state.scores.concat(newScore);
        console.log(newScore);

        const newQuestion = this.getRandomQuestion(!inInitRounds && this.state.questionBuffer[1]);
        const newQuestionBuffer = this.state.questionBuffer.slice(inInitRounds ? 0 : 1).concat(newQuestion);

        const newAnswers = this.state.answers.concat({letter: this.state.letterMatch, pos: this.state.positionMatch});

        this.setState({
            questionBuffer: newQuestionBuffer,
            currentRound: this.state.currentRound + 1,
            positionMatch: false,
            letterMatch: false,
            answers: newAnswers,
            scores: newScores
        });
    }

    handleStopRound = () => {
        // const newScore = this.calculateScore(this.state.questionBuffer, this.state.positionMatch, this.state.letterMatch);
        // const newScores = this.state.scores.concat(newScore);

        clearInterval(this.state.progressInterval);
        this.props.dispatch(setViewState(VIEW_STATES.STATS_VIEW));
    }

    getRandomInt(offset, length, leaveOutNum = false) {
        return offset + Math.floor(
            leaveOutNum
                ? (leaveOutNum + 1 + (Math.random() * (length - 1))) % length
                : Math.floor(Math.random() * length)
        );
    }

    getRandomQuestion(prevQuestion) {
        let letter, pos;

        if (!prevQuestion) {
            letter = String.fromCharCode(this.getRandomInt(65, 25));
            pos = this.getRandomInt(0, 9);
        } else {
            const showLastLetter = (Math.random() * 100) < 29.3;
            const showLastPos = (Math.random() * 100) < 29.3;
            const lastLetter = showLastLetter && prevQuestion.letter;
            const lastPos = showLastPos && prevQuestion.pos;
            letter = lastLetter ? lastLetter : String.fromCharCode(this.getRandomInt(65, 25, lastLetter));
            pos = lastPos ? lastPos : this.getRandomInt(0, 9, lastPos);
        }

        return {letter, pos};
    }

    calculateScore(series, positionMatch, letterMatch) {
        const prevState = series.slice(-1 - this.props.nBack)[0];
        const currState = series.slice(-1)[0];
        const posSame = prevState.pos === currState.pos;
        const posScore = positionMatch === posSame;
        const letterSame = prevState.letter === currState.letter;
        const letterScore = letterMatch === letterSame;
        return {pos: posScore, letter: letterScore};
    }

    handleMatchBtn = e => {
        this.setState({[e.target.name]: e.target.checked});
    }

    renderBoard() {
        return(
            <div className="board">
                { 
                    [...Array(9)].map((cell, index) => {
                        const shouldShow = index === this.state.questionBuffer.slice(-1)[0].pos; 
                        const letterClasses = 'displayLetter' + (shouldShow ? ' show' : '');
                        return (
                            <div className={'cell' + (shouldShow ? ' active' : '')} key={index}>
                                <span className={letterClasses}>
                                    { this.state.questionBuffer.slice(-1)[0].letter }
                                </span>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    render() {
        const disableMatchBtns = this.state.currentRound <= this.props.nBack;
        return (
            <div className="gameScreen">
                <header className="gameHeader">
                    <h1>Dual {this.props.nBack} Back</h1>
                    <button className="cancelBtn" onClick={this.handleStopRound}>Cancel</button>
                </header>
                <div className="boardContainer">
                    { this.renderBoard() }
                </div>
                <div className="progressBarHolder">
                    <div className="progressBar"></div>
                </div>
                <div className="matchBtnRow">
                    <label className="matchBtn">
                        <input type="checkbox" name="letterMatch" checked={this.state.letterMatch} onChange={this.handleMatchBtn} disabled={disableMatchBtns}/>
                        <span>Letter match</span>
                    </label>
                    <label className="matchBtn">
                        <input type="checkbox" name="positionMatch" checked={this.state.positionMatch} onChange={this.handleMatchBtn} disabled={disableMatchBtns}/>
                        <span>Position match</span>
                    </label>
                </div>
                <div className="pager"> <span className="number">{this.state.currentRound}</span> <span className="separator">/</span> <span className="number">{this.props.totalRounds}</span> </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(GameView);
