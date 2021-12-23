import { Button } from 'antd';

function Title({ username }) {
	return (
		<div className="App-title">
      <h1>{username}'s Chat Room</h1>
      {/*<Button type="primary" danger onClick={clearMessages}>
        Clear
      </Button>*/}
    </div>
	);
}

export default Title;