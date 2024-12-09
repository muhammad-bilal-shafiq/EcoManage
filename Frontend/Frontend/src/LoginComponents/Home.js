
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  axios.defaults.withCredentials = true;
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    axios.get('http://localhost:4000', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          setCompanies(res.data.companies);

        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch(err => console.error(err));
  }, []);


  function handleLogout() {
    axios.get('http://localhost:4000/logout', { withCredentials: true })
      .then(() => {
        // Clear authentication state and redirect to login page
        setAuth(false);
        navigate('/');
      })
      .catch(err => console.error(err));
  }

  const handleDelete = async (id) => {
    try {
      if (id) {
        await axios.delete(`http://localhost:4000/delete/${id}`);
        window.location.reload();
      } else {
        console.error('Invalid id for deletion');
      }
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <>
      <div className='container mt-4'>
        {auth ?
          <div>
            <div>
              <nav className="bg-gray-800 p-4 bottom-5 relative">
                <div className="container mx-auto flex justify-between items-center">
                  <div className="space-x-4">
                    <div className="flex items-center">
                      <div className="text-white font-bold text-xl flex items-center">
                        <img className="w-12 h-12 mr-2 rounded-2xl " src="data:image/png;base64,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" alt="logo">
                        </img>
                        <p>EcoManage Admin Panel</p>
                      </div>
                    </div>
                    <div className="space-x-4 mt-3 mr-20">
                      <button className="text-white hover:text-gray-300 mx-1">
                        <Link to="/Createcomp" className='bg-green-700 px-3 rounded inline text-white hover:text-gray-300 transition-colors duration-300'>Add Company +</Link>
                      </button>
                      <button className="text-white hover:text-gray-300 mx-1">
                        <Link to="/ApproveSection" className='bg-green-700 px-3 rounded block text-white hover:text-gray-300 transition-colors duration-300'>Unapproved List</Link>
                      </button>
                      <button className="text-white hover:text-gray-300 mx-1">
                        <button className='bg-green-800 rounded px-7' onClick={handleLogout}>Logout</button>
                      </button>
                      <Link to={`UpdateCompany`} className='bg-blue-600 text-white ml-1 px-7 rounded-md'>UpdateCompany +-</Link>
                      <Link to={`deletionlog`} className='bg-sky-800 text-white mx-1 px-7 rounded-md'>Deletion_log</Link>

                    </div>
                  </div>
                </div>
              </nav>


              <h1 className='text-4xl'>Welcome to Admin Panel for EcoManage</h1>
              <div className='flex h-96 '>
                <div className='w-48 bg-white rounded p-3'>

                <table className='table border w-full'>
  <thead className='bg-gray-800 text-white'>
    <tr className='px-4'>
      <th className='py-2'>Cid</th>
      <th className='py-2'>Cname</th>
      <th className='py-2'>VCode</th>
      <th className='py-2'>SWaste_Total</th>
      <th className='py-2'>Em_Total</th>
      <th className='py-2'>SWaste_Disposed</th>
      <th className='py-2'>Area</th>
      <th className='py-2'>Company_Key</th>
      <th className='py-2'></th>
      <th className='py-2'></th>
      <th className='py-2'></th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(companies) ? (
      companies.map((data, i) => (
        <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
          <td className='py-2 px-4'>{data.Cid}</td>
          <td className='py-2 px-4'>{data.Cname}</td>
          <td className='py-2 px-4'>{data.VCode}</td>
          <td className='py-2 px-4'>{data.SWaste_Total}</td>
          <td className='py-2 px-4'>{data.Em_Total}</td>
          <td className='py-2 px-4'>{data.SWaste_Disposed}</td>
          <td className='py-2 px-4'>{data.Area}</td>
          <td className='py-2 px-4'>{data.Company_Key}</td>
          <td className='py-2 px-4'>
            <Link className='bg-red-600 text-white px-4 py-1 rounded-md' onClick={e => handleDelete(data.Cid)}>Delete</Link>
          </td>
          <td className='py-2 px-4'>
            <Link to={`emissionpage/${data.Cid}`} className='bg-gray-600 text-white px-4 py-1 rounded-md'>Emissions</Link>
          </td>
          <td className='py-2 px-4'>
            <Link to={`Tax/${data.Cid}`} className='bg-sky-800 text-white px-4 py-1 rounded-md'>Penalty</Link>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="11" className='py-2 px-4 text-center text-gray-500'>
          No data available
        </td>
      </tr>
    )}
  </tbody>
</table>


                </div>
              </div>

            </div>

          </div> :



          <div>
            <h3>{message}</h3>
            <h3>Login Now</h3>
            <Link to="/" className='bg-blue-600'>Login</Link>
          </div>
        }
      </div>
    </>

  )
}

export default Home