import { useState } from 'react';

const useChatBox = () => {
	const [chatBoxes, setChatBoxes] = useState([]);

	const createChatBox = async (friend) => {
		if (chatBoxes.filter(x => x === friend).length > 0) return;
		setChatBoxes(x => [...x, friend]);
	};
	const removeChatBox = (targetKey, activeKey) => {
		setChatBoxes(x => x.filter(y => y !== targetKey));

		if (targetKey !== activeKey) return activeKey;
		for (let i = 0; i < chatBoxes.length; i++) {
			if (chatBoxes[i] !== targetKey) return chatBoxes[i];
		}
	};

	return { chatBoxes, createChatBox, removeChatBox };
};

export default useChatBox;