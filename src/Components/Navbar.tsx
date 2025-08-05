"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { TbMenu3 } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsGear } from "react-icons/bs";
import { ACCOUNTS, COLORS } from "@/constants/Data";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle dropdown item clicks
  const handleItemClick = (action: string) => {
    setIsDropdownOpen(false);
    if (action === "signout") {
      router.push("/auth/login");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    window.dispatchEvent(
      new CustomEvent("toggle-sidebar", { detail: { open: newState } })
    );
  };

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const custom = e as CustomEvent;
      setSidebarOpen(custom.detail?.open);
    };

    window.addEventListener("sidebar-toggled", handleToggle);
    return () => window.removeEventListener("sidebar-toggled", handleToggle);
  }, []);

  return (
    <>
      {/* MOBILE, TABLET */}
      <div className="sticky top-0 w-full border-b border-[var(--border)] bg-[var(--primary)] p-4 md:p-6 lg:p-7 z-30 gap-4 xl:hidden flex flex-col light-shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className=" text-2xl md:text-3xl font-semibold text-[var(--text)]">
            Good Evening, <span>User</span>
          </h2>

          <div className="flex items-center justify-end md:justify-between gap-4">
            <IoNotificationsOutline className="size-6 cursor-pointer" />
            <BsGear className="size-6 cursor-pointer" />
            <div
              onClick={toggleDropdown}
              className="flex items-center justify-center gap-2"
            >
              {/* Profile Image */}
              <Image
                src="/Navbar/user.jpg"
                width={48}
                height={48}
                alt="Person"
                className="rounded-full object-cover w-10 h-10"
              />
              {/* Name */}
              <div className="flex flex-col items-start">
                <span className="text-base text-[var(--text)] font-medium leading-snug">
                  Name
                </span>
              </div>
              {/* Dropdown Icon */}
              <FaChevronDown
                className={`h-3 w-3 text-[var(--text)] transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            <TbMenu3
              className="block xl:hidden absolute md:relative top-4 right-4 md:top-0 md:right-0 text-[var(--text)]"
              size={30}
              type="button"
              onClick={toggleSidebar}
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-2 mt-28 w-36 bg-[var(--secondary)] border border-[var(--border)] rounded-lg shadow-lg z-20">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 text-[var(--text)] hover:bg-[var(--secondary)] cursor-pointer"
                    onClick={() => handleItemClick("signout")}
                  >
                    Sign Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="sticky top-0 border-b border-[var(--border)] h-fit w-full bg-[var(--primary)] p-6 2xl:p-7 z-30 gap-7 2xl:gap-0 hidden xl:flex items-center justify-between light-shadow">
        <h2 className=" text-2xl md:text-3xl font-semibold ">
          Good Evening, <span>User</span>
        </h2>

        <div className="flex items-center justify-between gap-4 2xl:gap-6">
          <IoNotificationsOutline className="size-6 cursor-pointer" />
          <BsGear className="size-6 cursor-pointer" />

          <div className="relative" ref={dropdownRef}>
            {/* Profile Section */}
            <div
              className="group flex items-center justify-center gap-2 2xl:gap-3 cursor-pointer"
              onClick={toggleDropdown}
            >
              {/* Profile Image */}
              <div className="group relative">
                <div
                  className="w-8 h-8 border border-[var(--border)] rounded-full text-[var(--text)] flex items-center justify-center text-sm font-medium -ml-2"
                  style={{ backgroundColor: COLORS[0 % COLORS.length] }}
                >
                  {ACCOUNTS[0].charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-base text-[var(--text)] font-medium leading-snug">
                  {ACCOUNTS[0]}
                </span>
              </div>
              {/* Dropdown Icon */}
              <FaChevronDown
                className={`h-3 w-3 text-[var(--text)] transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--secondary)] border border-[var(--border)] rounded-lg shadow-lg z-20">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 text-[var(--text)] hover:bg-[var(--secondary)] cursor-pointer"
                    onClick={() => handleItemClick("signout")}
                  >
                    Sign Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
