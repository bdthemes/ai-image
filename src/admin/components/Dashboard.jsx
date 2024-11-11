import React, { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
// import Settings from "./includes/Settings";
import Pixels from "./includes/Pixels";
import Pixabay from "./includes/Pixabay";
import OpenAIImageGenerator from "./includes/OpenAI";

import {
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
} from "@material-tailwind/react";

// WordPress variables
const ajaxUrl = AI_IMAGE_AdminConfig.ajax_url; // Replace with your WordPress AJAX URL
const nonce = AI_IMAGE_AdminConfig.nonce; // WordPress nonce for security

const Dashboard = () => {
	const data = [
		{
			label: "Pixels",
			value: "pixels",
			desc: <Pixels />,
		},
		{
			label: "Pixabay",
			value: "pixabay",
			desc: <Pixabay />,
		},
		{
			label: "OpenAI",
			value: "openai",
			desc: <OpenAIImageGenerator />,
		},
	];
	const uploadImage = async (imageUrl) => {
		Swal.fire({
			title: "Uploading...",
			text: "Please wait while we upload the image.",
			allowOutsideClick: false,
			showConfirmButton: false,
			willOpen: () => {
				Swal.showLoading();
			},
		});

		try {
			const response = await fetch(AI_IMAGE_AdminConfig.ajax_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',  // For WordPress AJAX requests
					'X-WP-Nonce': AI_IMAGE_AdminConfig.nonce,  // Add the nonce here
				},
				body: new URLSearchParams({
					action: 'upload_image_to_wp',
					image_url: imageUrl,
					nonce: AI_IMAGE_AdminConfig.nonce,  // Send nonce for security
				})
			});

			const data = await response.json();  // Parse the JSON response

			if (response.ok && data.success) {
				Swal.fire({
					icon: 'success',
					title: 'Image Uploaded Successfully',
					text: `Attachment ID: ${data.data.attach_id}`
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Upload Failed',
					text: data.data || 'An unknown error occurred.'
				});
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Request Failed',
				text: error.message || 'An unknown error occurred.'
			});
		}
	};



	useEffect(() => {
		const handleGlobalClick = (event) => {
			if (event.target.classList.contains('bdt-aimg-download-btn')) {
				const imageUrl = event.target.getAttribute('data-url');
				if (imageUrl) {
					uploadImage(imageUrl);
				}
			}
		};

		document.addEventListener('click', handleGlobalClick);

		return () => {
			document.removeEventListener('click', handleGlobalClick);
		};
	}, []);
	return (
		<>
			<div className="ai-image-dashboard">
				<Tabs value="pixels" orientation="horizontal" className="flex-col">
					<div class="flex gap-4">
						<div class="w-[70%]">
							<TabsHeader className=" bg-white rounded-lg p-3 bg-opacity-100">
								{data.map(({ label, value, icon }) => (
									<Tab
										key={value}
										value={value}
										className="w-auto flex gap-3 p-3 px-5 m-0 header-tab"
									>
										<div className="flex items-center gap-2 font-medium ">
											{label}
											{icon}
										</div>
									</Tab>
								))}
							</TabsHeader>
						</div>
						<div>

						</div>
					</div>
					<TabsBody>
						{data.map(({ value, desc }) => (
							<TabPanel key={value} value={value} className="py-4 px-0" id={value}>
								{desc}
							</TabPanel>
						))}
					</TabsBody>
				</Tabs>
			</div>
		</>
	);
};

export default Dashboard;
