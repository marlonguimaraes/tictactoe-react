import { PlayerOrEmpty } from './index';

const lineWinner = (row: PlayerOrEmpty[]): PlayerOrEmpty => {
    const rowSet = new Set<PlayerOrEmpty>(row);
    if (rowSet.size === 1 && row[0] !== '') {
        return row[0];
    }
    return '';
};

export const winner = (cell: PlayerOrEmpty[][]): PlayerOrEmpty => {
    for (let i = 0; i < cell.length; i++) {
        const row = lineWinner(cell[i]);
        if (row !== '') {
            return row;
        }
        const col = lineWinner([cell[0][i], cell[1][i], cell[2][i]]);
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
