/*
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();

*/

import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { winner } from './winner';

type Player = 'X' | 'O';
export type PlayerOrEmpty = Player | '';

type SquareProps = {
    player: PlayerOrEmpty;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

function Square(props: SquareProps): ReactElement {
    return (
        <button className='square' onClick={props.onClick}>
            {props.player}
        </button>
    );
}
class BoardState {
    cell: PlayerOrEmpty[][];
    player: Player;
    winner: PlayerOrEmpty;
    constructor() {
        this.player = 'X';
        this.cell = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ];
        this.winner = '';
    }
}

type BoardProps = {
    cell: PlayerOrEmpty[][];
    onClick: (row: number, column: number) => void;
};
class Board extends React.Component<BoardProps> {
    renderSquare(row: number, column: number) {
        return (
            <Square
                onClick={() => {
                    this.props.onClick(row, column);
                }}
                player={this.props.cell[row][column]}
            />
        );
    }

    createRow = (index: number): JSX.Element[] => {
        const row = new Array<JSX.Element>(3);
        for (let i = 0; i < 3; i++) {
            row[i] = this.renderSquare(index, i);
        }
        return row;
    };

    createRows = (): JSX.Element[] => {
        return [0, 1, 2].map((index: number) => (
            <div className='board-row'>{this.createRow(index)}</div>
        ));
    };

    render() {
        return <div>{this.createRows()}</div>;
    }
}

class GameState {
    history: BoardState[];
    currentBoard: number;
    constructor() {
        this.history = new Array<BoardState>();
        this.history.push(new BoardState());
        this.currentBoard = 0;
    }

    last = (): BoardState => {
        return this.history[this.currentBoard];
    };
}

class Game extends React.Component {
    state: GameState;
    constructor(props: any) {
        super(props);
        this.state = new GameState();
    }

    render() {
        const currentBoardState = this.state.history[this.state.currentBoard];
        return (
            <div className='game'>
                {this.statusMessage(currentBoardState)}
                <div className='game-board'>
                    <Board
                        onClick={this.onCellClick}
                        cell={currentBoardState.cell}
                    />
                </div>
                <div className='game-info'>
                    <button
                        className='move-history w-100'
                        onClick={() => this.setState(new GameState())}
                    >
                        Restart game
                    </button>
                    {this.state.history.map(
                        (_: BoardState, index: number): JSX.Element =>
                            this.renderHistory(index)
                    )}
                </div>
            </div>
        );
    }

    renderHistory = (index: number): JSX.Element => {
        return (
            <button
                className='move-history w-100'
                onClick={() => {
                    this.setState({ currentBoard: index });
                    debugger;
                }}
            >{`Reset board to Move ${index}`}</button>
        );
    };

    onCellClick = (row: number, column: number): void => {
        const currentState = this.state.history[this.state.currentBoard];
        if (
            currentState.cell[row][column] !== '' ||
            currentState.winner !== ''
        ) {
            return;
        }

        const nextBoardState = new BoardState();
        nextBoardState.player = currentState.player === 'X' ? 'O' : 'X';
        nextBoardState.cell = JSON.parse(JSON.stringify(currentState.cell));
        nextBoardState.cell[row][column] = currentState.player;
        nextBoardState.winner = winner(nextBoardState.cell);
        const nextState = new GameState();
        nextState.currentBoard = this.state.currentBoard + 1;
        nextState.history = JSON.parse(
            JSON.stringify(
                this.state.history.slice(0, this.state.currentBoard + 1)
            )
        );
        nextState.history.push(nextBoardState);
        this.setState(nextState);
        debugger;
    };

    statusMessage = (state: BoardState): JSX.Element => {
        let message = '';
        debugger;
        if (state.winner !== '') {
            message = `The winner is: ${state.winner}!`;
        } else if (this.isDraw(state.cell)) {
            message = `Draw, play again!`;
        } else {
            message = `Next to play: ${state.player}`;
        }
        return <div className='status w-100'>{message}</div>;
    };

    isDraw = (cell: PlayerOrEmpty[][]): boolean => {
        for (let i = 0; i < cell.length; i++) {
            if (
                cell[i].filter((cell: PlayerOrEmpty): boolean => cell === '')
                    .length > 0
            ) {
                return false;
            }
        }
        return true;
    };
}

ReactDOM.render(<Game />, document.getElementById('root'));
