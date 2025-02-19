import { createRoot } from 'react-dom/client';
import Dashboard from './components/Dashboard';
/**
 * Import the stylesheet for the plugin.
 */
import './style/app.css';
import './style/main.scss';

/**
 * Render the App component into the DOM
 */
const container = document.getElementById('ai-image-generator');
if (container) {
	const root = createRoot(container);
	root.render(<Dashboard />);
}
