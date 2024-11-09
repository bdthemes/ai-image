import React from "react";
import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { __ } from "@wordpress/i18n";

import Swal from "sweetalert2";


const Settings = () => {
  const [getsettings, setgetSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [getSections, setGetDataFromConditions] = useState("");
  const [conditions, setConditions] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    apiFetch({ path: "/spin-wheel/v1/time-now" }).then((res) => {
      setCurrentDate(res.currentDate);
      setCurrentTime(res.currentTime);
    });
  }, []);

  const queryParams = {
    option_name: "spin_wheel_settings",
  };

  useEffect(() => {
    apiFetch({
      path: addQueryArgs("/spin-wheel/v1/settings", queryParams),
    }).then((res) => {
      setgetSettings(res.otherData);
      setConditions(res.conditions);
      setLoading(false);
    });
  }, []);

  function handleDataFromConditions(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return;
    }
    setGetDataFromConditions(data);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.showLoading();

    const formData = new FormData(e.target);
    const data = {};

    for (let [key, value] of formData.entries()) {
      /**
       * If checkbox, store the value as boolean
       */
      if (value === "on") {
        value = true;
      }
      /**
       * Remove empty values
       */
      if (value === "") {
        continue;
      }

      data[key] = value;
    }
    /**
     * If enable_wc is checked, set the global variable to true
     */
    if (data?.enable_wc) {
      window.WOF_LocalizeAdminConfig.enable_wc = true;
      document.body.classList.add('spin-wheel-enable-wc');
    } else {
      window.WOF_LocalizeAdminConfig.enable_wc = false;
    }

    const finalFormData = {
      option_name: "spin_wheel_settings",
      conditions: getSections && getSections.map((section) => ({
        condition: section.condition.condition_code,
        // conditionValue: ['logged_in', 'logged_out'],
        conditionValue: Array.isArray(section.lang) ? section.lang.map((lang) => lang.code) : [section.lang.code],
        link: section.link
      })),
      otherData: {
        ...data,
      },
    };

    apiFetch({
      path: "/spin-wheel/v1/settings",
      method: "POST",
      data: finalFormData,
    }).then((res) => {
      setTimeout(() => {
        Swal.fire({
          title: "Success",
          text: "Settings saved successfully",
          icon: "success",
          timer: 1500,
        });
      }, 500);
    });
  };

  const [campaignName, setCampaignName] = useState(getsettings?.campaign_name || 'AA');

  useEffect(() => {
    setCampaignName(getsettings?.campaign_name || 'Happy Offers');
  }, [getsettings]);

  const handleChangeCampaignName = (event) => {
    setCampaignName(event.target.value);
  };

  /**
   * Update the global variable whenever getsettings?.enable_wc changes
   */
  useEffect(() => {
    if (getsettings?.enable_wc) {
      window.WOF_LocalizeAdminConfig.enable_wc = true;
      document.body.classList.add('spin-wheel-enable-wc');
    } else {
      window.WOF_LocalizeAdminConfig.enable_wc = false;
    }
  }, [getsettings]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-8 flex-col xl:flex-row">
          {/* left side content here */}
          <div className="flex gap-8 xl:flex-col w-full 2xl:w-1/3">
            <div className="bg-white p-6 rounded-lg  w-full xl:w-auto">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white block"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    />
                  </svg>

                  <h2 className="text-base font-semibold m-0">
                    {__("Settings", "spin-wheel")}
                  </h2>
                </div>
              </div>
              <div className="mt-5">
                <label className="font-semibold uppercase text-xs text-gray-800 mb-1 block">
                  {__("Campaign Name", "spin-wheel")}:{" "}
                </label>
                <input
                  type="text"
                  name="campaign_name"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={campaignName}
                  onChange={handleChangeCampaignName}
                />
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="font-semibold uppercase text-xs text-gray-800 ">
                  {__("Status", "spin-wheel")}:{" "}
                </span>
                {getsettings?.enable_status ? (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    {__("Active", "spin-wheel")}
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {__("Paused", "spin-wheel")}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    name="enable_status"
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={getsettings?.enable_status}
                    onChange={(e) => {
                      setgetSettings({
                        ...getsettings,
                        enable_status: e.target.checked,
                      });
                    }}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {__("Enable Wheel Popup", "spin-wheel")}
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer mt-4">
                  <input
                    name="dev_mode"
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={getsettings?.dev_mode}
                    onChange={(e) => {
                      setgetSettings({
                        ...getsettings,
                        dev_mode: e.target.checked,
                      });
                    }}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {__("Development Mode ?", "spin-wheel")}
                  </span>
                </label>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg flex-col flex gap-5 w-full xl:w-auto">
              <p className="text-base font-semibold m-0">
                {__("Which devices will this popup appear?", "spin-wheel")}
              </p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  name="visibility_desktop"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={getsettings?.visibility_desktop || true}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {__("Desktop", "spin-wheel")}
                </span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  name="visibility_tablet"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={getsettings?.visibility_tablet || true}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {__("Tablet", "spin-wheel")}
                </span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  name="visibility_mobile"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={getsettings?.visibility_mobile || true}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {__("Mobile", "spin-wheel")}
                </span>
              </label>
            </div>
            {/* {Spam Protection} */}
            <div className="bg-white p-6 rounded-lg flex-col flex gap-5  w-full xl:w-auto">
              <p className="text-base font-semibold m-0">
                {__("Spam Protection", "spin-wheel")}
              </p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  name="email_coupon"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={getsettings?.email_coupon}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {__("Email Coupon", "spin-wheel")}
                </span>
              </label>
              <p className="mt-2 mb-4 text-sm block max-w-lg">
                {__(
                  "Send coupon code to the subscriber's email after submitting the form.",
                  "spin-wheel"
                )}
              </p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  name="invisible_recaptcha"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={getsettings?.invisible_recaptcha}
                  disabled
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {__("Enable Invisible reCAPTCHA (Coming Soon)", "spin-wheel")}
                </span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  name="double_optin"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={getsettings?.double_optin}
                  disabled
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {__("Enable Double Options (Coming Soon)", "spin-wheel")}
                </span>
              </label>
            </div>
            {/* {/Spam Protection} */}

            {/* {WooCommerce} */}
            <div className="bg-white p-6 rounded-lg flex-col flex gap-5  w-full xl:w-auto">
              <p className="text-base font-semibold m-0">
                {__("WooCommerce", "spin-wheel")}
              </p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  name="enable_wc"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={getsettings?.enable_wc}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {__("Enable WooCommerce?", "spin-wheel")}
                </span>
              </label>
              <p className="mt-2 mb-4 text-sm block max-w-lg">
                {__(
                  "Enable this option to show the auto coupon sync within the Coupon Setting Tab.",
                  "spin-wheel"
                )}
              </p>
            </div>
            {/* {/WooCommerce} */}
          </div>

          <div className="w-full">
            <div className="w-full bg-white rounded-lg">
              <div className="p-8">
                <h2 className="text-xl font-semibold">
                  {__("Display rules", "spin-wheel")}
                </h2>

                <p className="text-base font-semibold m-0 mt-5">
                  {__("When to show the popup / campaign ?", "spin-wheel")}
                </p>

                <div className="flex flex-col gap-5 mt-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Display Option</label>
                  <select
                    name="display_option"
                    value={getsettings?.display_option || "on_page_load"}
                    onChange={(e) => {
                      setgetSettings({
                        ...getsettings,
                        display_option: e.target.value,
                      });
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="on_page_load">{__("On Page Load", "spin-wheel")}</option>
                    <option value="on_exit">{__("On Exit", "spin-wheel")}</option>
                    <option value="on_scroll">{__("On Scroll", "spin-wheel")}</option>
                    <option value="on_inactivity">{__("On Inactivity", "spin-wheel")}</option>
                    <option value="on_click" disabled={WOF_LocalizeAdminConfig.isPro ? false : 'disabled'}>
                      {__("On Click", "spin-wheel")}
                      {
                        WOF_LocalizeAdminConfig.isPro ? null : (
                          <span className="text-xs text-red-500">{__(" (Pro)", "spin-wheel")}</span>
                        )
                      }
                    </option>
                    <option value="on_referrer" disabled={WOF_LocalizeAdminConfig.isPro ? false : 'disabled'}>
                      {__("Referrer", "spin-wheel")}
                      {
                        WOF_LocalizeAdminConfig.isPro ? null : (
                          <span className="text-xs text-red-500">{__(" (Pro)", "spin-wheel")}</span>
                        )
                      }
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-5 mt-5">
                  {getsettings?.display_option && getsettings?.display_option == 'on_scroll' ? (
                    <div className="flex gap-4 items-center max-w-[30rem]">
                      <label
                        htmlFor="scroll-percent-range"
                        className="block text-sm font-medium text-gray-900 dark:text-white w-auto"
                      >
                        {__("Show on scroll percentage", "spin-wheel")} :
                      </label>
                      <input
                        name="show_on_scroll_percent"
                        id="scroll-percent-range"
                        type="range"
                        className=" w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        defaultValue={getsettings?.show_on_scroll_percent}
                        onChange={(e) => {
                          setgetSettings({
                            ...getsettings,
                            show_on_scroll_percent: e.target.value,
                          });
                        }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {getsettings?.show_on_scroll_percent}%
                      </span>
                    </div>
                  ) : null}

                  {/* Show on scroll end  */}

                  {/* Show on inactivity start */}
                  {getsettings?.display_option && getsettings?.display_option == 'on_inactivity' ? (
                    <div className="max-w-[24rem] flex items-center gap-5">
                      <label
                        htmlFor="default-range"
                        className="block text-sm font-medium text-gray-900 dark:text-white w-auto"
                      >
                        {__("Inactivity Time", "spin-wheel")} :
                      </label>
                      <div className="relative flex w-60">
                        <input
                          name="show_on_inactivity_time"
                          defaultValue={getsettings?.show_on_inactivity_time}
                          type="number"
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-s-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700  dark:border-gray-600 placeholder-gray-700 dark:text-white dark:focus:border-blue-500 "
                          placeholder="(Default: 0)"
                        />
                        <button
                          className="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                          type="button"
                        >
                          {__("Seconds", "spin-wheel")}
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {/* Show on inactivity end  */}
                </div>
                {getsettings?.display_option && getsettings?.display_option == 'on_page_load' ? (
                  <div className="mt-2">
                    <h3 className="text-base p-0 m-0 text-gray-800 font-semibold">
                      {__("Show popup after visitor spends", "spin-wheel")}
                    </h3>
                    <p className="mt-2 mb-4 text-sm block max-w-lg">
                      {__(
                        "How much time does the visitor have to spend on a page before the popup appears.",
                        "spin-wheel"
                      )}
                    </p>
                    <div className="max-w-[18rem] flex">
                      <div className="relative w-full">
                        <input
                          name="show_after_time"
                          defaultValue={getsettings?.show_after_time}
                          type="number"
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-s-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700  dark:border-gray-600 placeholder-gray-700 dark:text-white dark:focus:border-blue-500"
                          placeholder="(Default: 0)"
                        />
                      </div>
                      <button
                        className="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                        type="button"
                      >
                        {__("Seconds", "spin-wheel")}
                      </button>
                    </div>
                  </div>
                ) : null}
                {/* Show on click start */}
                {getsettings?.display_option && getsettings?.display_option == 'on_click' ? (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{__("Selector", "spin-wheel")}</label>
                    <input
                      name="on_click_selectors"
                      defaultValue={getsettings?.on_click_selectors}
                      type="text" id="on_click_selectors" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-[25rem]"
                      placeholder="Ex: #selector"
                    />
                  </div>
                ) : null}
                {/* Show on click end  */}
                {/* Show on referrer start */}
                {getsettings?.display_option && getsettings?.display_option == 'on_referrer' ? (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{__("Contains", "spin-wheel")}</label>
                    <input
                      name="referrer_contains"
                      defaultValue={getsettings?.referrer_contains}
                      type="text" id="referrer_contains" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-[25rem]"
                      placeholder="facebook.com"
                    />
                  </div>
                ) : null}
                {/* Show on referrer end  */}
                <div className="mt-5">
                  <h3 className="text-base p-0 m-0 text-gray-800 font-semibold">
                    {__(
                      "When the popup should re-appear to the same visitor ?",
                      "spin-wheel"
                    )}
                  </h3>
                  <p className="mt-2 mb-4 text-sm block max-w-lg">
                    {__(
                      "( When a visitor has seen this popup, how long we should wait before showing the popup for the same visitor. )",
                      "spin-wheel"
                    )}
                  </p>
                  <div className="max-w-[18rem] flex">
                    <div className="relative w-full">
                      <input
                        name="reappear_time"
                        defaultValue={getsettings?.reappear_time}
                        type="number"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-s-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700  dark:border-gray-600 placeholder-gray-700 dark:text-white dark:focus:border-blue-500"
                        placeholder="Ex:10  (Default: 0)"
                      />
                    </div>
                    <button
                      data-dropdown-toggle="dropdown-currency"
                      className="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                      type="button"
                    >
                      {__("Days", 'spin-wheel')}{" "}
                      <svg
                        className="w-2.5 h-2.5 ms-2.5 hidden"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                    <div
                      id="dropdown-currency"
                      className="hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdown-currency-button"
                      >
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            <div className="inline-flex items-center">
                              {__("Days", "spin-wheel")}
                            </div>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            <div className="inline-flex items-center">
                              {__("Weeks", "spin-wheel")}
                            </div>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="text-base p-0 m-0 text-gray-800 font-semibold">
                    {__("When the Popup will be show / hide ?", "spin-wheel")}
                  </h3>
                  <p className="mt-2 mb-4 text-sm block max-w-lg">
                    {__(
                      "( When a visitor has submitted the form in this popup, how long we should wait before showing the popup for the same subscriber. )",
                      "spin-wheel"
                    )}
                  </p>
                  {loading ? (
                    <p>{__("Loading...", "spin-wheel")}</p>
                  ) : (
                    <>
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <label className="text-base p-0 m-0 text-gray-800 font-semibold">
                            {__("Start Date", "spin-wheel")}
                          </label>
                          <DatePicker
                            className="w-60"
                            showTimeSelect
                            showTimeInput
                            name="date_start"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            selected={
                              new Date(getsettings?.date_start || new Date())
                            }
                            minDate={new Date(2023, 0, 1)}
                            onChange={(date) => {
                              setgetSettings({
                                ...getsettings,
                                date_start: date,
                              });
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-base p-0 m-0 text-gray-800 font-semibold">
                            {__("End Date", "spin-wheel")}
                          </label>
                          <DatePicker
                            className="w-60"
                            showTimeSelect
                            showTimeInput
                            name="date_end"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            selected={
                              // new Date(getsettings?.date_end || new Date())
                              // add 7 days to the current date
                              new Date(getsettings?.date_end || new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                            }
                            onChange={(date) => {
                              setgetSettings({
                                ...getsettings,
                                date_end: date,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <p className="muted italic mt-1">
                        {__("Your Time", "spin-wheel")} : {currentDate}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right mt-5">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {__("Save Settings", "spin-wheel")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default Settings;
