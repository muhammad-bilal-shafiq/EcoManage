
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
    axios.get('http://localhost:4000/ApproveSection', { withCredentials: true })
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






  const handleReject = async (id) => {
    try {
      if (id) {
        await axios.delete(`http://localhost:4000/reject/${id}`);
        window.location.reload();
      } else {
        console.error('Invalid id for deletion');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      if (id) {
        await axios.put(`http://localhost:4000/approve/${id}`);
        window.location.reload();
      } else {
        console.error('Invalid id for approving');
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
              <h1 className='text-4xl'>Pending Companies awaiting Approval</h1>
              <div className='flex h-96 '>
                <div className='w-48 bg-white rounded p-3'>

                  <table className='table border w-full'>
                    <thead className='bg-gray-800 text-white'>
                      <tr className='border-b'>
                        <th className='py-3 px-6 text-left'>Cid</th>
                        <th className='py-3 px-6 text-left'>Cname</th>
                        <th className='py-3 px-6 text-left'>VCode</th>
                        <th className='py-3 px-6 text-left'>SWaste_Total</th>
                        <th className='py-3 px-6 text-left'>Em_Total</th>
                        <th className='py-3 px-6 text-left'>Tax</th>
                        
                        <th className='py-3 px-6 text-left'>Date_Joined</th>
                        
                        <th className='py-3 px-6 text-left'>SWaste_Disposed</th>
                        <th className='py-3 px-6 text-left'>Area</th>
                        <th className='py-3 px-6 text-left'>Status</th>
                        <th className='py-3 px-6'></th>
                        <th className='py-3 px-6'></th>
                        <th className='py-3 px-6'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(companies) ? (
                        companies.map((data, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-gray-100 border-b' : 'bg-white border-b'}>
                            <td className='py-3 px-6'>{data.Cid}</td>
                            <td className='py-3 px-6'>{data.Cname}</td>
                            <td className='py-3 px-6'>{data.VCode}</td>
                            <td className='py-3 px-6'>{data.SWaste_Total}</td>
                            <td className='py-3 px-6'>{data.Em_Total}</td>
                            <td className='py-3 px-6'>{data.Tax}</td>
                            <td className='py-3 px-6'>{data.Date_Joined}</td>
                            <td className='py-3 px-6'>{data.SWaste_Disposed}</td>
                            <td className='py-3 px-6'>{data.Area}</td>
                            <td className='py-3 px-6'>{data.Status}</td>
                            <td className='py-3 px-6'>
                              <Link className='bg-green-600 text-white px-7 py-2 rounded-md' onClick={e => handleApprove(data.Cid)}>Approve</Link>
                            </td>
                            <td className='py-3 px-6'>
                              <Link className='bg-red-600 text-white px-7 py-2 rounded-md' onClick={e => handleReject(data.Cid)}>Reject</Link>
                            </td>
                            <td className='py-3 px-6'>
                              <Link to={`emissionpage/${data.Cid}`} className='bg-gray-600 text-white px-7 py-2 rounded-md'>Emissions</Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="15" className='py-3 px-6 text-center text-gray-500'>
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