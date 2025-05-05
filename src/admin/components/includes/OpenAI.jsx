import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadBtn from './components/DownloadBtn';
import ImportBtn from './components/ImportBtn';
import Author from './components/Author';
import Preview from './components/Preview';

const OpenAIImageGenerator = () => {
	const [query, setQuery] = useState(''); // User input query
	const [generatedImages, setGeneratedImages] = useState([]); // Array of generated image URLs
	const [loading, setLoading] = useState(false); // Loading state
	const [error, setError] = useState(null); // Error state
	const [debouncedQuery, setDebouncedQuery] = useState(query); // Debounced query to prevent unnecessary API calls
	const [apiKey, setApiKey] = useState(''); // OpenAI API key

	const endpoint = 'https://api.openai.com/v1/images/generations'; // OpenAI Image Generation endpoint

	// Fetch the API key from the REST API endpoint
	useEffect(() => {
		const fetchApiKey = async () => {
			try {
				const response = await axios.post(
					`${AI_IMAGE_AdminConfig.rest_url}openai/api-key`,
					{},
					{
						headers: {
							'X-WP-Nonce': AI_IMAGE_AdminConfig.nonce,
						},
					}
				);
				if (response.data && response.data.api_key) {
					setApiKey(response.data.api_key);
				} else {
					setError('Failed to fetch API key.');
				}
			} catch (err) {
				setError('Error fetching API key. Go to dashboard Settings→AI Image to configure your API key.');
			}
		};

		fetchApiKey();
	}, []);

	// Debounce the search input change
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500); // 500ms delay

		return () => clearTimeout(handler);
	}, [query]);

	// Generate Image function
	const generateImage = async () => {
		if (!debouncedQuery || !apiKey) return; // If no query or API key is entered, do nothing

		setLoading(true); // Start loading
		setError(null); // Clear previous errors

		try {
			const response = await axios.post(
				endpoint,
				{
					prompt: debouncedQuery,
					n: 2, // Number of images to generate (to show multiple sizes)
					size: '512x512', // Medium size for preview
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${apiKey}`,
					},
				}
			);

			if (response.data && response.data.data) {
				setGeneratedImages(response.data.data); // Set the generated images
			}
		} catch (err) {
			setError('Error generating image. Please try again.'); // Set error message
		} finally {
			setLoading(false); // Stop loading
		}
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		generateImage();
	};

	return (
		<div>
			{/* Search bar */}
			<form className="ai-image-search mb-8" onSubmit={handleSubmit}>
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					type="text"
					placeholder="Enter a prompt for image generation"
				/>
				<button
					type="submit"
					disabled={loading}
				>
					{loading ? 'Generating...' : 'Generate Image'}
				</button>
			</form>

			{/* Loading indicator */}
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="aiImg-col-wrap">
					{/* Display generated images */}
					{generatedImages.map((image, index) => (
						<div key={index} className="card ai-img-item">
							<div className="aiImg-image-wrap w-full h-full">
								<img
									src={image.url} // Display the generated image (Medium size for preview)
									className="card-img-top w-full h-full object-cover"
									alt="Generated"
									loading="lazy" // Lazy load the image
								/>
								<Preview url={image.url} />
							</div>
							<div className="aiImg-content-wrap">
								<Author
									url="#"
									avatar={`${AI_IMAGE_AdminConfig.assets_url}imgs/ChatGPT_logo.svg.png`}
									name="OpenAI"
								/>
								<div className="aiImg-download-and-drop-wrap">
									<ImportBtn url={image.url} />
									<div className="download-button-dropdown">
										<button className="dropbtn aiImg-drop-btn ai-image-drop-btn">
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
													d="m19 9-7 7-7-7"
												/>
											</svg>
										</button>
										<div className="download-button-content">
											<DownloadBtn
												label="Small"
												type="small"
												url={image.url} // Small size for download
											/>
											<DownloadBtn
												label="Medium"
												type="medium"
												url={image.url} // Medium size for download
											/>
											<DownloadBtn
												label="Large"
												type="large"
												url={image.url} // Large size for download
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Error message */}
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default OpenAIImageGenerator;
