import { useState } from 'react';
import { Tabs } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import ChatBox from './ChatBox';
import useChatBox from '../Hooks/useChatBox';

import {
  CREATE_CHATBOX_MUTATION
} from '../graphql/index';

function ChatRoom({ me, displayStatus, activeKey, setActiveKey }) {
	const { chatBoxes, createChatBox, removeChatBox } = useChatBox();
	const [startChat] = useMutation(CREATE_CHATBOX_MUTATION);

	return (
		<Tabs
			tabBarStyle={{ height: "36px" }}
			type="editable-card"
			activeKey={activeKey}
			onChange={
				key => { setActiveKey(key); }
			}
			onEdit={
				async (targetKey, action) => {
					if (action === "add") {
						let friend = prompt("Enter friend name", "Bob");
						await startChat({
							variables: {
								name1: me,
								name2: friend
							}
						});
						createChatBox(friend);
						setActiveKey(friend);
					}
					else if (action === "remove") {
						setActiveKey(removeChatBox(targetKey, activeKey));
					}
				}
			}
		>
			{
				chatBoxes.map(friend => {
					return (
						<Tabs.TabPane tab={friend} closable={true} key={friend}>
							<ChatBox me={me} friend={friend} key={friend} />
						</Tabs.TabPane>
					);
				})
			}
		</Tabs>
	);
};

export default ChatRoom;