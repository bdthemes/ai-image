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
	const [loading, setLoading] = useState(true);
	const [scrollLoading, setScrollLoading] = useState(false);
	const [debouncedQuery, setDebouncedQuery] = useState(query);
	const api_pexels = "l7Pk56fQ7sjfslcgFBUXVuggY5sZ2EIRLtSvM1pBwLyzpIWjdQ93gVpH";
	const rest_url = "https://api.pexels.com/v1/";

	const searchMode = debouncedQuery.trim() !== "";

	const fetchImages = useCallback(async () => {
		try {
			if (page === 1) {
				setLoading(true);
			} else {
				setScrollLoading(true);
			}

			const endpoint = searchMode ? "search" : "curated";
			const url = `${rest_url}${endpoint}`;

			const params = {
				page,
				per_page: 12,
				...(searchMode && { query: debouncedQuery })
			};

			const response = await axios.get(url, {
				params,
				headers: { Authorization: api_pexels },
			});

			if (response.data && response.data.photos) {
				setImages((prevImages) =>
					page === 1 ? response.data.photos : [...prevImages, ...response.data.photos]
				);
			}
		} catch (error) {
			console.error("Error fetching images:", error);
		} finally {
			setLoading(false);
			setScrollLoading(false);
		}
	}, [debouncedQuery, page, searchMode]);

	useEffect(() => {
		fetchImages();
	}, [fetchImages]);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
			setPage(1);
		}, 500);

		return () => clearTimeout(handler);
	}, [query]);

	const handleSearch = (e) => {
		setQuery(e.target.value);
	};

	// Function to load more images when the button is clicked
	const loadMore = () => {
		setPage((prevPage) => prevPage + 1); // Increase page number to load more images
	};

	return (
		<div>
			<div className="ai-image-search mb-8">
				<input
					value={query}
					onChange={handleSearch}
					type="text"
					placeholder="Search images..."
				/>
				<button type="submit">
					<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
						<path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"></path>
					</svg>
				</button>
			</div>

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
									loading="lazy" // Lazy load the image
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
											<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
												<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
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

			{/* Load More Button */}
			{!loading && !scrollLoading && (
				<div className="text-center mt-8">
					<button onClick={loadMore} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
						Load More
					</button>
				</div>
			)}

			{scrollLoading && <p>Loading more images...</p>}
		</div>
	);
};

export default Pixels;
