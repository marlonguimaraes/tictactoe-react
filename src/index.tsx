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

type Player = 'X' | 'O';
type PlayerOrEmpty = Player | '';

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

const lineWinner = (row: PlayerOrEmpty[]): PlayerOrEmpty => {
    return new Set<PlayerOrEmpty>(row).size === 1 ? row[0] : '';
};

class Board extends React.Component {
    state: BoardState = new BoardState();

    onCellClick = (row: number, column: number): void => {
        if (this.state.winner !== '') {
            return;
        }

        if (this.state.cell[row][column].length === 0) {
            const nextState = new BoardState(
                this.state.player,
                this.state.cell,
                this.state.winner
            );
            nextState.player = this.state.player === 'X' ? 'O' : 'X';
            nextState.cell[row][column] = this.state.player;
            nextState.winner = this.winner(nextState.cell);
            this.setState(nextState);
        }
    };

    winner = (cell: PlayerOrEmpty[][]): PlayerOrEmpty => {
        for (let i = 0; i < cell.length; i++) {
            const row = lineWinner(cell[i]);
            if (row !== '') {
                return row;
            }
            const col = lineWinner([cell[i][0], cell[i][1], cell[i][2]]);
            if (col !== '') {
                return col;
            }
        }
        const mainDiagonal = lineWinner([cell[0][0], cell[1][1], cell[2][2]]);
        if (mainDiagonal !== '') {
            return mainDiagonal;
        }

        const secDiagonal = lineWinner([cell[0][2], cell[1][1], cell[2][0]]);
        return secDiagonal;
    };

    renderSquare(row: number, column: number) {
        return (
            <Square
                onClick={() => {
                    this.onCellClick(row, column);
                }}
                player={this.state.cell[row][column]}
            />
        );
    }

    render() {
        const status =
            this.state.winner === ''
                ? `Next player: ${this.state.player}`
                : `The winner is "${this.state.winner}"!`;

        return (
            <div>
                <div className='status'>{status}</div>
                <div className='board-row'>
                    {this.renderSquare(0, 0)}
                    {this.renderSquare(0, 1)}
                    {this.renderSquare(0, 2)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(1, 0)}
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(1, 2)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(2, 0)}
                    {this.renderSquare(2, 1)}
                    {this.renderSquare(2, 2)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className='game'>
                <div className='game-board'>
                    <Board />
                </div>
                <div className='game-info'>
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));
