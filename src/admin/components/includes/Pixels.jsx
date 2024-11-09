import React from "react";
import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import DownloadBtn from "./components/DownloadBtn";
import ImportBtn from "./components/ImportBtn";
import Author from "./components/Author";
import Preview from "./components/Preview";


const Pixels = () => {
	const [getsettings, setgetSettings] = useState({});
	const [loading, setLoading] = useState(true);


	return (
		<>
			<div class="grid grid-cols-2 md:grid-cols-3 gap-6">
				<div className="card h-auto max-w-full ai-img-item">
					<div className="aiImg-image-wrap">
						<img
							src="https://images.pexels.com/photos/29298929/pexels-photo-29298929.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
							className="card-img-top w-full"
							alt="Dakota Cox"
						/>
						<Preview
							url="https://www.pexels.com/photo/scenic-alpine-village-in-hallstatt-austria-29298929/"
						/>
					</div>
					<div className="aiImg-content-wrap">
						<Author
							url="https://www.pexels.com/@dakota-cox-2086518719/"
							avatar="https://images.pexels.com/users/avatars/2086518719/dakota-cox-494.png?auto=compress&fit=crop&h=130&w=130&dpr=1"
							name="Dakota Cox"
						/>
						<div className="aiImg-download-and-drop-wrap">
							<ImportBtn
								url="https://images.pexels.com/photos/29298929/pexels-photo-29298929.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
							/>
							<div className="download-button-dropdown">
								<button
									className="dropbtn aiImg-drop-btn ai-image-drop-btn">
									<svg
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width={24}
										height={24}
										fill="none"
										viewBox="0 0 24 24">
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="m19 9-7 7-7-7"
										/>
									</svg>
								</button>
								<div className="download-button-content">
									<DownloadBtn label='Original' type='original' />
									<DownloadBtn label='Large' type='large' />
									<DownloadBtn label='Medium' type='medium' />
									<DownloadBtn label='Small' type='small' />
									<DownloadBtn label='Tiny' type='tiny' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Pixels;
