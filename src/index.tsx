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
    constructor(
        player: Player = 'X',
        cell: PlayerOrEmpty[][] | null = null,
        winner: PlayerOrEmpty = ''
    ) {
        this.player = player;
        if (cell) {
            this.cell = cell.slice();
        } else {
            this.cell = [
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
            ];
        }
        this.winner = winner;
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
    constructor() {
        this.history = new Array<BoardState>();
        this.history.push(new BoardState());
    }

    last = (): BoardState => {
        return this.history[this.history.length - 1];
    };

    copy = (): GameState => {
        let c = new GameState();
        c.history = this.history.slice();
        return c;
    };
}

class Game extends React.Component {
    state: GameState;
    constructor(props: any) {
        super(props);
        this.state = new GameState();
    }

    render() {
        return (
            <div className='game'>
                {this.statusMessage(this.state.last())}
                <div className='game-board'>
                    <Board
                        onClick={this.onCellClick}
                        cell={this.state.last().cell}
                    />
                </div>
                <div className='game-info'>
                    <button onClick={() => this.setState(new GameState())}>
                        Restart game
                    </button>
                </div>
            </div>
        );
    }

    onCellClick = (row: number, column: number): void => {
        if (
            this.state.last().cell[row][column] ||
            this.state.last().winner !== ''
        ) {
            return;
        }

        const nextBoardState = new BoardState(
            this.state.last().player,
            this.state.last().cell,
            this.state.last().winner
        );
        nextBoardState.player = this.state.last().player === 'X' ? 'O' : 'X';
        nextBoardState.cell[row][column] = this.state.last().player;
        nextBoardState.winner = winner(nextBoardState.cell);
        const nextState = this.state.copy();
        nextState.history.push(nextBoardState);
        this.setState(nextState);
    };

    statusMessage = (state: BoardState): JSX.Element => {
        let message = '';
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
