const flowbite = require("flowbite-react/tailwind");


const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // "./includes/Admin/Views/*.php",
    flowbite.content()
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin()
  ],
	important: '.ai-image-wrap',
})

