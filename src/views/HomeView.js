import React from 'react';
import { connect } from 'react-redux';
import { setViewState, setNBack, VIEW_STATES } from '../actions';

const mapStateToProps = state => ({
    viewState: state.viewState,
    nBack: state.gameOptions.nBack
});

class HomeView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.testLength = 21;
        this.nBackUpperLimit = Math.min(Math.floor(this.testLength / 2));
    }

    handleStartRound = e => {
        this.props.dispatch(setViewState(VIEW_STATES.GAME_VIEW));
    }

    handleIncreaseNBack = e => {
        if (this.props.nBack < this.nBackUpperLimit) {
            this.props.dispatch(setNBack(this.props.nBack + 1));
        }
    }

    handleDecreaseNBack = e => {
        if (this.props.nBack > 1) {
            this.props.dispatch(setNBack(this.props.nBack - 1));
        }
    }

    render() {
        const decreaseDisabled = this.props.nBack <= 1;
        const increaseDisabled = this.props.nBack >= this.nBackUpperLimit;
        return (
            <div className="homeScreen">
                <header>
                    <h1>Dual N-Back</h1>
                </header>
                <div className="menuItems">
                    <div className="menuItem">How to play</div>
                    <div className="menuItem">Options</div>
                    <div className="menuItem">Statistics</div>
                    <div className="modeSelector">
                        <button className="menuItem" onClick={this.handleDecreaseNBack} disabled={decreaseDisabled}>
                            <i className="fas fa-caret-left"></i>
                        </button>
                        <div className="menuItem">{ this.props.nBack } Back</div>
                        <button className="menuItem" onClick={this.handleIncreaseNBack} disabled={increaseDisabled}>
                            <i className="fas fa-caret-right"></i>
                        </button>
                    </div>
                    <button className="startBtn" onClick={this.handleStartRound}>Start</button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(HomeView);
