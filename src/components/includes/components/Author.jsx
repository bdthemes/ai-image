import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Author = (props) => {
	let { url, avatar, name } = props;
	return (
		<>
			<a href={url || 'javascript:void(0);'} className="aiImg-author-wrap">
				{avatar ? (
					<img
						src={avatar}
						className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
						alt={name}
					/>
				) : (
					<FontAwesomeIcon icon={faUser} className="w-6 h-6 p-2 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" />
				)}
				<span className="aiImg-author-name">
					{name}
				</span>
			</a>
		</>
	);
}

export default Author;
