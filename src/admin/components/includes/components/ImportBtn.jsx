import React from "react";

const ImportBtn = (props) => {
	let { url } = props;
	return (
		<button
			className="dropbtn aiImg-drop-btn bdt-aimg-download-btn-large bdt-aimg-download-btn"
			data-url={url}
		>
			Import
			<svg
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width={24}
				height={24}
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
				/>
			</svg>
		</button>
	);
}

export default ImportBtn;
