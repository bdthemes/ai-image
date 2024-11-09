import React from "react";
// import Settings from "./includes/Settings";
import Pixels from "./includes/Pixels";

import {
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
} from "@material-tailwind/react";

const Dashboard = () => {
	const data = [
		{
			label: "Pixels",
			value: "pixels",
			desc: <Pixels />,
		},
		{
			label: "Test",
			value: "test",
			desc: '<Test />',
		}
	];

	return (
		<>
			<div className="ai-image-dashboard">
				<Tabs value="pixels" orientation="horizontal" className="flex-col">
					<div class="flex gap-4">
						<div class="w-[70%]">
							<TabsHeader className=" bg-white rounded-lg p-3 bg-opacity-100">
								{data.map(({ label, value, icon }) => (
									<Tab
										key={value}
										value={value}
										className="w-auto flex gap-3 p-3 px-5 m-0 header-tab"
									>
										<div className="flex items-center gap-2 font-medium ">
											{label}
											{icon}
										</div>
									</Tab>
								))}
							</TabsHeader>
						</div>
						<div>
							<form id="aiImage-search-form" class="ai-image-search">
								<input type="text" id="aiImage-search-input" placeholder="Search for images" />
								<button type="submit">
									<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"></path>
									</svg>
								</button>
							</form>
						</div>
					</div>
					<TabsBody>
						{data.map(({ value, desc }) => (
							<TabPanel key={value} value={value} className="py-4 px-0" id={value}>
								{desc}
							</TabPanel>
						))}
					</TabsBody>
				</Tabs>
			</div>
		</>
	);
};

export default Dashboard;
