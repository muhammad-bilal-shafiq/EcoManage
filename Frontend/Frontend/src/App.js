import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './LoginComponents/AdminLogin';
import Home from './LoginComponents/Home';
import Createcomp from './LoginComponents/Createcomp.js';
import UpdateCompany from './LoginComponents/UpdateCompany';
import ApproveSection from './LoginComponents/ApproveSection.js';
import Startpage from './LoginComponents/Startpage.js';
import CompanyEdit from './LoginComponents/CompanyEdit.js';
import CompanyLogin from './LoginComponents/CompanyLogin.js';
import Emissionpage from './LoginComponents/emissionpage.js';
import Publicpage from './LoginComponents/Publicpage.js';
import Publicemissionpage from './LoginComponents/Publicemissionpage.js';
import Tax from './LoginComponents/Tax.js';
import Deletion_log from './LoginComponents/Deletion_log.js';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path='/CompanyLogin' element={<CompanyLogin />} />
        <Route path="/CompanyEdit" element={<CompanyEdit />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/approvesection" element={<ApproveSection />} />
        <Route path="/createcomp" element={<Createcomp />} />
        <Route path="/home/UpdateCompany" element={<UpdateCompany />} />
        <Route path="/home/emissionpage/:cid" element={<Emissionpage />} />
        <Route path="/publicpage/publicemissionpage/:cid" element={<Publicemissionpage />} />
        <Route path="/ApproveSection/emissionpage/:cid" element={<Emissionpage />} />
        <Route path="/home/Tax/:cid" element={<Tax/>} />
        <Route path="/publicpage" element={<Publicpage />} />
        <Route path="/home/deletionlog" element={<Deletion_log />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
