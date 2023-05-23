/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

// Save function
export default function save({ attributes }) {
	const { content } = attributes;
	const blockProps = useBlockProps.save();
	return <div {...blockProps}>{content}</div>;
}
