import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DownloadBtn from "./components/DownloadBtn";
import ImportBtn from "./components/ImportBtn";
import Author from "./components/Author";
import Preview from "./components/Preview";

const Pixels = () => {
	const [images, setImages] = useState([]);
	const [query, setQuery] = useState("nature");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true); // Initial loading
	const [scrollLoading, setScrollLoading] = useState(false); // Loading when scrolling bottom
	const api_pexels = "l7Pk56fQ7sjfslcgFBUXVuggY5sZ2EIRLtSvM1pBwLyzpIWjdQ93gVpH";

	// Fetch images based on search query and page
	const fetchImages = useCallback(async () => {
		try {
			if (page === 1) {
				setLoading(true); // Show initial loading spinner
			} else {
				setScrollLoading(true); // Show scroll loading spinner
			}

			const response = await axios.get(`https://api.pexels.com/v1/search`, {
				params: { query, page, per_page: 6 },
				headers: { Authorization: api_pexels },
			});

			if (response.data && response.data.photos) {
				setImages((prevImages) => (page === 1 ? response.data.photos : [...prevImages, ...response.data.photos]));
			}
		} catch (error) {
			console.error("Error fetching images:", error);
		} finally {
			setLoading(false); // Hide initial loading spinner
			setScrollLoading(false); // Hide scroll loading spinner
		}
	}, [query, page]);

	// Trigger initial image fetch on mount and whenever the query or page changes
	useEffect(() => {
		fetchImages();
	}, [fetchImages]);

	// Handle search input changes
	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPage(1); // Reset to the first page on new search
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
			<div style={{ marginBottom: "20px" }}>
				<input
					type="text"
					placeholder="Search images..."
					value={query}
					onChange={handleSearch}
					style={{ padding: "10px", width: "100%", maxWidth: "400px" }}
				/>
			</div>

			{/* Loading indicator on initial load */}
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-3 md:grid-cols-4 gap-6">
					{images.map((image) => (
						<div class="grid gap-6">
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
										avatar={AI_IMAGE_LocalizeAdminConfig.assetsUrl + 'imgs/avatar-human.svg'}
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
