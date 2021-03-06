import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={`square ${props.className}`}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {    
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                key={i}
                onClick={() => this.props.onClick(i)}
                className={this.props.winnerLine.includes(i) ? 'winner-line': ''}
            />
        );
    }

    fillTable() {
        let table = [];
        let squares = [];

        for (let i = 0; i < 9; i++) {
            squares = squares.concat(this.renderSquare(i));

            if ((i % 3) === 2) {
                table = table.concat(
                    <div className="board-row" key={i}>
                        {squares}
                    </div>
                );

                squares = [];
            }
        }

        return table;
    }

    render() {
        return (<div>{this.fillTable()}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0
        };
    }

    getCurrent(history) {
        return history[this.state.stepNumber];
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = this.getCurrent(history);
        const squares = current.squares.slice();

        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const { history } = this.state;
        const current = this.getCurrent(history);
        const { winner, line } = calculateWinner(current.squares);
        const totalPositions = 9;
        let status;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === totalPositions) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerLine={line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
            winner: squares[a],
            line: lines[i]
        };
      }
    }
    return {
        winner: '',
        line: []
    };
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
