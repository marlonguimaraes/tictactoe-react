import { PlayerOrEmpty } from './index';

const lineWinner = (row: PlayerOrEmpty[]): PlayerOrEmpty => {
    return new Set<PlayerOrEmpty>(row).size === 1 ? row[0] : '';
};

export const winner = (cell: PlayerOrEmpty[][]): PlayerOrEmpty => {
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
