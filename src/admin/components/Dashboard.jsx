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
    }
  ];
  return (
    <>
      <div className="ai-image-dashboard">
        <div className="">
					<Tabs value="pixels" orientation="horizontal" className="flex-col">
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
            <TabsBody>
              {data.map(({ value, desc }) => (
                <TabPanel key={value} value={value} className="py-4 px-0" id={value}>
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
