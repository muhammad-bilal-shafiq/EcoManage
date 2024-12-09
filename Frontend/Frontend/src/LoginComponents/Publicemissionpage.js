import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function Publicemissionpage() {
  const { cid } = useParams();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  axios.defaults.withCredentials = true;
  const [emission, setEmissionPage] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/publicemissionpage/${cid}`, { withCredentials: true })
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

                <table className='table border'>
                  <thead>
                    <tr className='px-20'>
                      <th>Cid</th>
                      <th>CO2 (m³)</th>
                      <th>NO2 (m³)</th>
                      <th>CO (m³)</th>
                      <th>NO (m³)</th>
                      <th>Last Month Check</th>
                      <th>Prev Method Installed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(emission) ? (
                      emission.map((data, i) => (
                        <tr key={i}>
                          <td>{data.Cid}</td>
                          <td>{data.CO2}</td>
                          <td>{data.NO2}</td>
                          <td>{data.CO}</td>
                          <td>{data.NO}</td>
                          <td>{data.Last_Month_Check}</td>
                          <td>{data.Prev_Method_Installed}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='7'>No data available</td>
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

export default Publicemissionpage;