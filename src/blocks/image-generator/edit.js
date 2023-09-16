/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Button,
	Placeholder,
	TextareaControl,
	Flex,
	FlexBlock,
	FlexItem,
	__experimentalNumberControl as NumberControl,
	SelectControl,
	Spinner,
} from '@wordpress/components';

// editor style
import './editor.scss';

export default function Edit({ attributes, clientId }) {
	const [loadingImages, setLoadingImages] = useState(false);
	const [resultImages, setResultImages] = useState([]);
	const [prompt, setPrompt] = useState();
	const [number, setNumber] = useState(4);
	const [size, setSize] = useState('512x512');
	const { replaceBlock } = useDispatch(blockEditorStore);
	const [errorMessage, setErrorMessage] = useState('');



	const { mediaUpload } = useSelect((select) => {
		const { getSettings } = select(blockEditorStore);
		const settings = getSettings();
		return {
			mediaUpload: settings.mediaUpload,
		};
	}, []);

	const handleSubmit = () => {
		setLoadingImages(true);
		apiFetch({
			path: '/bdthemes/v1/openai/images/generations',
			method: 'POST',
			data: {
				prompt,
				number,
				size,
			},
		})
			.then((res) => {
				setLoadingImages(false);
				if (res.error && res.error.message) {
					setErrorMessage(res.error.message);
					return;
				}
				const images = res.data.map((image) => {
					return 'data:image/png;base64,' + image.b64_json;
				});
				setResultImages(images);
			})
			.catch((res) => {
				if (res.code === 'no_api_key') {
					setErrorMessage(
						__(
							'Please visit settings and input valid OpenAI token',
							'ai-image'
						)
					);
					setLoadingImages(false);
				}
			});
	};
	return (
		<div {...useBlockProps()}>
			{!loadingImages && errorMessage && (
				<Placeholder
					style={{ display: 'block', width: '100%' }}
					label={__('AI Image', 'ai-image')}
					notices={[
						// eslint-disable-next-line react/jsx-key
						<div style={{ color: 'red' }}>
							{errorMessage}
							{errorMessage ===
								'Please visit settings and input valid OpenAI token' && (
									<FlexItem>
										<Button
											href="options-general.php?page=bdthemes-ai-image-options"
											target="_blank"
										>
											{__(
												'Visit Openai Settings',
												'ai-image'
											)}
										</Button>
									</FlexItem>
								)}
						</div>,
					]}
				>
					<div
						className="ai-image-form"
						style={{ display: 'block', width: '100%' }}
					>
						<TextareaControl
							label={__(
								'What would you like to see?',
								'ai-image'
							)}
							help={__(
								'Describe the image you would like to see, this is a required field',
								'ai-image'
							)}
							onChange={setPrompt}
							value={prompt}
							required
						/>
						<NumberControl
							label={__('Number of images', 'ai-image')}
							help={
								__('Number of Generated Images: ', 'ai-image') +
								number
							}
							value={number}
							onChange={(value) => setNumber(value)}
							min={1}
							max={10}
							placeholder="4"
							type="number"
						/>
						<SelectControl
							label={__('Image size', 'ai-image')}
							help={
								__('Generated Images Size: ', 'ai-image') +
								size || '512x512'
							}
							value={size}
							options={[
								{
									label: __('Large', 'ai-image'),
									value: '1024x1024',
								},
								{
									label: __('Medium', 'ai-image'),
									value: '512x512',
								},
								{
									label: __('Small', 'ai-image'),
									value: '256x256',
								},
							]}
							onChange={(newSize) => {
								setSize(newSize);
							}}
						/>

						<Button
							style={{ display: 'block', width: '100%' }}
							variant="primary"
							onClick={() => {
								setErrorMessage('');
								handleSubmit();
							}}
						>
							{__('Retry', 'ai-image')}
						</Button>
					</div>
				</Placeholder>
			)}
			{!errorMessage && !attributes.requestedPrompt && (
				<Placeholder label={__('AI Image', 'ai-image')}>
					<div
						className="ai-image-form"
						style={{ display: 'block', width: '100%' }}
					>
						<TextareaControl
							label={__(
								'What would you like to see?',
								'ai-image'
							)}
							help={__(
								'Describe the image you would like to see',
								'ai-image'
							)}
							onChange={setPrompt}
							required
						/>
						<NumberControl
							label={__('Number of images', 'ai-image')}
							help={
								__('Number of Generated Images: ', 'ai-image') +
								number || 4
							}
							max={10}
							min={1}
							value={number}
							onChange={(value) => setNumber(value)}
							placeholder="4"
							type="number"
						/>
						<SelectControl
							label={__('Image size', 'ai-image')}
							help={
								__('Generated Image Size: ', 'ai-image') + size
							}
							value={size}
							options={[
								{
									label: __('Large', 'ai-image'),
									value: '1024x1024',
								},
								{
									label: __('Medium', 'ai-image'),
									value: '512x512',
								},
								{
									label: __('Small', 'ai-image'),
									value: '256x256',
								},
							]}
							onChange={(newSize) => {
								setSize(newSize);
							}}
						/>

						<Button
							style={{ display: 'block', width: '100%' }}
							variant="primary"
							onClick={() => {
								handleSubmit();
							}}
						>
							{resultImages.length > 0
								? __('Regenerate', 'ai-image')
								: __('Generate', 'ai-image')}
						</Button>
					</div>
				</Placeholder>
			)}
			{!errorMessage && !loadingImages && resultImages.length > 0 && (
				<Placeholder label={__('AI Image', 'ai-image')}>
					<div>
						<div>{attributes.requestedPrompt}</div>
						<div style={{ fontSize: '20px', lineHeight: '38px' }}>
							{__('Please choose your image', 'ai-image')}
						</div>
						<Flex direction="row" justify={'space-between'}>
							{resultImages.map((image, index) => (
								<FlexBlock
									key={index}
									style={{ cursor: 'pointer' }}
								>
									<img
										// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
										role="button"
										className="wp-block-openai-image"
										src={image}
										alt={attributes.requestedPrompt}
										onClick={async () => {
											if (loadingImages) {
												return;
											}
											setLoadingImages(true);
											const resp = await fetch(image);
											const blob = await resp.blob();
											const file = new File(
												[blob],
												'openai-image-generator_image.png',
												{ type: 'image/png' }
											);
											mediaUpload({
												filesList: [file],
												onFileChange: ([img]) => {
													if (!img.id) {
														return;
													}
													replaceBlock(
														clientId,
														createBlock(
															'core/image',
															{
																url: img.url,
																caption:
																	attributes.requestedPrompt,
																alt: attributes.requestedPrompt,
															}
														)
													);
												},
												allowedTypes: ['image'],
												onError: () => {
													setLoadingImages(false);
												},
											});
										}}
									/>
								</FlexBlock>
							))}
						</Flex>
					</div>
				</Placeholder>
			)}
			{loadingImages && !errorMessage && (
				<Placeholder
					label={__('AI Image is loading please wait…', 'ai-image')}
				>
					<div>
						<Spinner style={{ height: '30px', width: '30px' }} />
					</div>
				</Placeholder>
			)}
		</div>
	);
}
