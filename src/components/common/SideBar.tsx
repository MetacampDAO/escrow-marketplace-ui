import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
    const location = useLocation();

    return (
        <aside
            id="sidebar"
            className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
            aria-label="Sidebar"
        >
            <div className="relative flex-1 flex flex-col min-h-0 border-r border-slate-800 bg-slate-900 pt-0">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex-1 px-3 bg-slate-900 divide-y space-y-1">
                        <ul className="space-y-2 pb-1">
                            <li>
                                <Link
                                    to="/"
                                    className={`text-base font-normal rounded-lg flex items-center p-2 hover:text-gray-900 hover:bg-gray-100 group ${
                                        location.pathname == '/' ? 'text-sky-400' : 'text-gray-300'
                                    }`}
                                >
                                    <svg
                                        className="w-6 h-6 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                    </svg>
                                    <span className="ml-3">Marketplace</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/wallet"
                                    className={`text-base font-normal rounded-lg flex items-center p-2 hover:text-gray-900 hover:bg-gray-100 group ${
                                        location.pathname == '/wallet' ? 'text-sky-400' : 'text-gray-300'
                                    }`}
                                >
                                    <svg
                                        className="w-6 h-6 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                                    </svg>
                                    <span className="ml-3">Manage NFTs</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
