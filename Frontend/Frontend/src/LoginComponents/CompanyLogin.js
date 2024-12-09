import React, { useState,useEffect } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function CompanyLogin () {
  
     const [Company_Key, setCompanyKey] = useState('')
     const navigate = useNavigate()
     axios.defaults.withCredentials = true;  

     const [companies,setCompanies] = useState([]);

     useEffect(() => {
      axios.get('http://localhost:4000/')
        .then(res => {
          console.log('Fetched data:', res.data);
          setCompanies(res.data.companies);
        })
        .catch(err => console.log(err));
    }, []);
    
 
     function handleSubmit(event){
      event.preventDefault();
      axios.post('http://localhost:4000/CompanyLogin', {Company_Key})
      .then(res =>{
          if(res.data.Status === "Success"){
            navigate('/CompanyEdit')
          }
          else {
            alert("Error");
            console.log(Company_Key)
          }
     })
      .then(err => console.log(err));
    }
     return ( 
    <section className="bg-gray-50 dark:bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-700">
          <img className="w-8 h-8 mr-2 " src="https://i.pinimg.com/736x/8a/eb/81/8aeb81235a448b1b088a81c75a370653.jpg" alt="logo" />
         EcoManage Company data Updation Login
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Key</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange = {e => setCompanyKey(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              
            </form>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default CompanyLogin;