import React from "react";

const Author = (props) => {
	let { url, avatar, name } = props;
	return (
		<>
			<a href={url || 'javascript:void(0);'} className="aiImg-author-wrap">
				<img
					src={avatar}
					className="aiImg-author-img"
					alt={name}
				/>
				<span className="aiImg-author-name">
					{name}
				</span>
			</a>
		</>
	);
}

export default Author;
