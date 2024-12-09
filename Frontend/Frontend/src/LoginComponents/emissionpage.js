import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function EmissionPage() {
  const { cid } = useParams();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  axios.defaults.withCredentials = true;
  const [emission, setEmissionPage] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/emissionpage/${cid}`, { withCredentials: true })
      .then((res) => {
        if (res.data.Status === 'Success') {
          setAuth(true);
          setName(res.data.name);
          setEmissionPage(res.data.emission);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  }, [cid]);

  return (
    <>
      <div className='container mt-4'>
        <div>
          <div>
            <h1 className='text-4xl'>Emission Log</h1>
            <div className='flex h-96 '>
              <div className='w-48 bg-white rounded p-3'>

                <table className='table border w-full'>
                  <thead className='bg-gray-800 text-white'>
                    <tr className='border-b'>
                      <th className='py-3 px-6 text-left'>Cid</th>
                      <th className='py-3 px-6 text-left'>CO2</th>
                      <th className='py-3 px-6 text-left'>NO2</th>
                      <th className='py-3 px-6 text-left'>CO</th>
                      <th className='py-3 px-6 text-left'>NO</th>
                      <th className='py-3 px-6 text-left'>Last_Month_Check</th>
                      <th className='py-3 px-6 text-left'>Prev_Method_Installed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(emission) ? (
                      emission.map((data, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-100 border-b' : 'bg-white border-b'}>
                          <td className='py-3 px-6'>{data.Cid}</td>
                          <td className='py-3 px-6'>{data.CO2}</td>
                          <td className='py-3 px-6'>{data.NO2}</td>
                          <td className='py-3 px-6'>{data.CO}</td>
                          <td className='py-3 px-6'>{data.NO}</td>
                          <td className='py-3 px-6'>{data.Last_Month_Check}</td>
                          <td className='py-3 px-6'>{data.Prev_Method_Installed}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='7' className='py-3 px-6 text-center text-gray-500'>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmissionPage;
