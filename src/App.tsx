import React, { FC, } from 'react';
import Context from './Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import ManageNFTs from './components/manageNFTs';
import NavBar from './components/common/NavBar';
import Main from './components/common/Main';

export const App: FC = () => {

    return (
        <Context>
            <BrowserRouter>
                <NavBar />
                <Main
                    childComp={
                        <Routes>
                            <Route path="/wallets" element={<ManageNFTs />} />
                            <Route path="/" element={<Home />} />
                        </Routes>
                    }
                />
            </BrowserRouter>
        </Context>
    );
};
