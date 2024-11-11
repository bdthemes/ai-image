import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DownloadBtn from "./components/DownloadBtn";
import ImportBtn from "./components/ImportBtn";
import Author from "./components/Author";
import Preview from "./components/Preview";

const Pixels = () => {
	const [images, setImages] = useState([]);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true); // Initial loading
	const [scrollLoading, setScrollLoading] = useState(false); // Loading when scrolling bottom
	const [debouncedQuery, setDebouncedQuery] = useState(query);
	const api_pexels = "l7Pk56fQ7sjfslcgFBUXVuggY5sZ2EIRLtSvM1pBwLyzpIWjdQ93gVpH";
	const rest_url = "https://api.pexels.com/v1/";

	// Determine if we are in search mode or curated mode
	const searchMode = debouncedQuery.trim() !== "";

	// Fetch images based on search query, page, and mode (search or curated)
	const fetchImages = useCallback(async () => {
		try {
			// Set loading states based on page
			if (page === 1) {
				setLoading(true); // Show initial loading spinner
			} else {
				setScrollLoading(true); // Show scroll loading spinner
			}

			// Determine URL based on search mode
			const endpoint = searchMode ? "search" : "curated";
			const url = `${rest_url}${endpoint}`;

			// Set up parameters for the API request
			const params = {
				page,
				per_page: 6,
				...(searchMode && { query: debouncedQuery }) // Add query parameter if in search mode
			};

			// Fetch data from Pexels API
			const response = await axios.get(url, {
				params,
				headers: { Authorization: api_pexels },
			});

			// Update the image state with new images
			if (response.data && response.data.photos) {
				setImages((prevImages) => (page === 1 ? response.data.photos : [...prevImages, ...response.data.photos]));
			}
		} catch (error) {
			console.error("Error fetching images:", error);
		} finally {
			setLoading(false); // Hide initial loading spinner
			setScrollLoading(false); // Hide scroll loading spinner
		}
	}, [debouncedQuery, page, searchMode]);

	// Trigger image fetch on mount and whenever the debounced query or page changes
	useEffect(() => {
		fetchImages();
	}, [fetchImages]);

	// Debounce the search input change
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
			setPage(1); // Reset to the first page on new search
		}, 500); // 500ms delay

		// Clean up the timeout if query changes before the delay is over
		return () => clearTimeout(handler);
	}, [query]);

	// Handle search input changes
	const handleSearch = (e) => {
		setQuery(e.target.value);
	};

	// Infinite scroll to load more images when scrolling to the bottom of the page
	const handleScroll = useCallback(() => {
		const isBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10;

		if (isBottom && !scrollLoading && !loading) {
			setPage((prevPage) => prevPage + 1); // Load next page
		}
	}, [scrollLoading, loading]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return (
		<div>
			{/* Search bar */}
			<div className="ai-image-search mb-8">
				<input
					value={query}
					onChange={handleSearch}
					type="text"
					placeholder="Search images..."
				/>
				<button type="submit">
					<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"></path>
					</svg>
				</button>
			</div>

			{/* Loading indicator on initial load */}
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-3 md:grid-cols-4 gap-6">
					{images.map((image) => (
						<div key={image.id} className="card ai-img-item">
							<div className="aiImg-image-wrap w-full h-full">
								<img
									src={image.src.medium}
									className="card-img-top w-full h-full object-cover"
									alt={image.alt}
								/>
								<Preview url={image.url} />
							</div>
							<div className="aiImg-content-wrap">
								<Author
									url={image.photographer_url}
									avatar={image.photographer_avatar || "https://via.placeholder.com/130"}
									name={image.photographer}
								/>
								<div className="aiImg-download-and-drop-wrap">
									<ImportBtn url={image.src.medium} />
									<div className="download-button-dropdown">
										<button className="dropbtn aiImg-drop-btn ai-image-drop-btn">
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
											<DownloadBtn label="Original" type="original" url={image.src.original} />
											<DownloadBtn label="Large" type="large" url={image.src.large} />
											<DownloadBtn label="Medium" type="medium" url={image.src.medium} />
											<DownloadBtn label="Small" type="small" url={image.src.small} />
											<DownloadBtn label="Tiny" type="tiny" url={image.src.tiny} />
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Loading indicator for additional data when scrolling */}
			{scrollLoading && <p>Loading more images...</p>}
		</div>
	);
};

export default Pixels;
