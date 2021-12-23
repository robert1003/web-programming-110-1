import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Message from "../Components/Message";

import {
  CHATBOX_QUERY,
  MESSAGE_SUBSCRIPTION
} from '../graphql/index';

const ChatBox = ({ me, friend, ...props }) => {

	const { data, loading, subscribeToMore } = useQuery(CHATBOX_QUERY, {
		variables: { name1: me, name2: friend }
	});

	useEffect(() => {
		try {
			console.log(data);
			subscribeToMore({
				document: MESSAGE_SUBSCRIPTION,
				variables: { name1: me, name2: friend },
				updateQuery: (prev, { subscriptionData }) => {
					if (!subscriptionData.data) return prev;
					const newMessage = subscriptionData.data.message;

					return Object.assign({}, prev, {
							chatbox: {
								messages: [...prev.chatbox.messages, newMessage]
							}
            });
				}
			});
			console.log(data);
		} catch (e) { console.log(e); }
	}, [subscribeToMore]);

	if (loading) return <p>loading</p>;
	return (
		<div className="App-messages">
			{
				data.chatbox.messages.length === 0 ? (
          <p style={{ color: '#ccc' }}>
            No messages...
          </p>
        ) : (
        	data.chatbox.messages.map(({ sender: { name }, body }, i) => (
						<Message me={me} name={name} body={body} key={name+body+i} />
					))
        )
			}
		</div>
	);
};

export default ChatBox;