import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DownloadBtn from "./components/DownloadBtn";
import ImportBtn from "./components/ImportBtn";
import Author from "./components/Author";
import Preview from "./components/Preview";

const Pixabay = () => {
	const [images, setImages] = useState([]);
	const [query, setQuery] = useState("nature");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true); // Initial loading
	const [scrollLoading, setScrollLoading] = useState(false); // Loading when scrolling bottom
	const [debouncedQuery, setDebouncedQuery] = useState(query);
	const api_pixabay = "27427772-5e3b7770787f4e0e591d5d2eb";

	// Fetch images based on search query and page
	const fetchImages = useCallback(async () => {
		try {
			if (page === 1) {
				setLoading(true); // Show initial loading spinner
			} else {
				setScrollLoading(true); // Show scroll loading spinner
			}

			const response = await axios.get(`https://pixabay.com/api/`, {
				params: {
					key: api_pixabay,
					q: debouncedQuery,
					image_type: "photo",
					page,
					per_page: 12,
					pretty: true
				}
			});

			if (response.data && response.data.hits) {
				setImages((prevImages) => (page === 1 ? response.data.hits : [...prevImages, ...response.data.hits]));
			}
		} catch (error) {
			console.error("Error fetching images:", error);
		} finally {
			setLoading(false); // Hide initial loading spinner
			setScrollLoading(false); // Hide scroll loading spinner
		}
	}, [debouncedQuery, page]);

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

	// Load more images when the button is clicked
	const loadMoreImages = () => {
		setPage((prevPage) => prevPage + 1); // Load next page
	};

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
									src={image.webformatURL}
									className="card-img-top w-full h-full object-cover"
									alt={image.tags}
								/>
								<Preview url={image.pageURL} />
							</div>
							<div className="aiImg-content-wrap">
								<Author
									url={`https://pixabay.com/users/${image.user}-${image.user_id}`}
									avatar={image.userImageURL || "https://via.placeholder.com/130"}
									name={image.user}
								/>
								<div className="aiImg-download-and-drop-wrap">
									<ImportBtn url={image.largeImageURL} />
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
											<DownloadBtn label="Large" type="large" url={image.largeImageURL} />
											<DownloadBtn label="Medium" type="medium" url={image.webformatURL} />
											<DownloadBtn label="Small" type="small" url={image.previewURL} />
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Load More button */}
			{!loading && (
				<div className="text-center mt-8">
					<button onClick={loadMoreImages} disabled={scrollLoading} className="load-more-btn">
						{scrollLoading ? "Loading more images..." : "Load More"}
					</button>
				</div>
			)}
		</div>
	);
};

export default Pixabay;
