import React from "react";

const DownloadBtn = (props) => {
	return (
		<button
			data-type={props.type}
			download
			className="btn btn-primary bdt-aimg-download-btn"
			data-url="https://images.pexels.com/photos/29298929/pexels-photo-29298929.jpeg"
		>
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
			<span>
				{props.label}
			</span>
		</button>
	);
}

export default DownloadBtn;
