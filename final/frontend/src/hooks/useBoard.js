import { createContext, useContext, useState, useEffect } from 'react';

const BoardContext = createContext({
	board: "",
	boardList: [],

	setBoard: () => {},
});

const BoardProvider = (props) => {
	const [board, _setBoard] = useState("");
	const [boardList, _setBoardList] = useState(["Board0", "Board1", "Board2"]);

	useEffect(() => {
		_setBoard(boardList[0]);
	}, []);

	const setBoard = (x) => {
		_setBoard(x);
	}

	return (
    <BoardContext.Provider
      value={{
        board,
        boardList,
        setBoard
      }}
      {...props}
    />
  );
};

function useBoard() {
  return useContext(BoardContext);
}

export { BoardProvider, useBoard };