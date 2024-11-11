import App from "./App";
import { render } from '@wordpress/element';

/**
 * Import the stylesheet for the plugin.
 */
import './style/app.css';
import './style/main.scss';

/**
 * Render the App component into the DOM
 */
if (document.getElementById('ai-image-generator')) {
	render(<App />, document.getElementById('ai-image-generator'));
}
