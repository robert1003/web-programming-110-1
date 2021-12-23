import { Tag } from 'antd';

function Message({ me, name, body, key }) {
	if (me === name) {
		return (
			<p className="App-message" key={key} style={{ textAlign: 'right' }}>
	      <Tag color="#d9d9d9">{body}</Tag>
	      {name}
	    </p>
		);
	} else {
		return (
			<p className="App-message" key={key} style={{ textAlign: 'left' }}>
	      {name}
	      <Tag color="#d9d9d9">{body}</Tag>
	    </p>
		);
	}
};

export default Message;