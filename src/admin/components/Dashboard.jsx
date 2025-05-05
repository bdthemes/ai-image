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

const switchAndReload = function (id) {

	if (!id) {
		return;
	}

	if (!document.querySelector('.ai-image-media-modal')) {
		return;
	}

	// get wp outside iframe

	var wp = parent.wp;

	// switch tabs (required for the code below)

	wp.media.frame.setState('insert');

	// refresh

	if (wp.media.frame.content.get() !== null) {
		wp.media.frame.content.get().collection.props.set({ ignore: (+ new Date()) });
		wp.media.frame.content.get().options.selection.reset();
	} else {
		wp.media.frame.library.props.set({ ignore: (+ new Date()) });
	}

};

const Dashboard = () => {
	const data = [
		{
			label: 'Pixels',
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
					html: `
						<div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
							<p style="color: #64748b; font-size: 15px; margin-bottom: 16px; font-weight: 500;">Your image is now in the media library</p>
							<div style="display: flex; max-width: 100%; margin: 0 auto; border-radius: 12px; overflow: hidden; transition: all 0.2s ease;">
								<input type="text" id="ai-copy-url-input" value="${data.data.attach_url}" readonly style="flex: 1; padding: 12px 16px; border: none; outline: none; font-size: 14px; background: #f8fafc; color: #334155;" />
								<a href="javascript:void(0);" class="ai-img-copy-url" data-clipboard-text="${data.data.attach_url}" style="display: flex; align-items: center; justify-content: center; padding: 0 16px; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; transition: all 0.2s ease;">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="min-width: 20px;">
										<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
										<rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
									</svg>
								</a>
							</div>
							<p style="color: #94a3b8; font-size: 12px; margin-top: 12px;">Click to copy the URL</p>
						</div>
					`,
					confirmButtonText: 'Done',
					didOpen: () => {
						const copyBtn = document.querySelector('.ai-img-copy-url');
						if (copyBtn) {
							copyBtn.addEventListener('click', function() {
								const input = document.getElementById('ai-copy-url-input');
								input.select();
								document.execCommand('copy');
								
								// Change background color
								this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
								
								// Store original icon and replace with checkmark icon
								const originalIcon = this.innerHTML;
								this.innerHTML = `
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="min-width: 20px;">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								`;
								
								// Reset after delay
								setTimeout(() => {
									this.style.background = 'linear-gradient(135deg, #3b82f6, #6366f1)';
									this.innerHTML = originalIcon;
								}, 1500);
								
								Swal.showToast({
									icon: 'success',
									title: 'URL copied to clipboard!',
									position: 'top-end',
									showConfirmButton: false,
									timer: 1500,
									toast: true
								});
							});
						}
					}
				});

				setTimeout(() => {
					switchAndReload(data.data.attach_id);
				}, 1000);

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

		if (!Swal.showToast) {
			Swal.showToast = Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true
			});
		}

		return () => {
			document.removeEventListener('click', handleGlobalClick);
		};
	}, []);
	return (
		<>
			<Tabs value="pixels" orientation="horizontal" className="flex-col">
				<div className="flex gap-4">
					<div className="w-[70%]">
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
		</>
	);
};

export default Dashboard;
