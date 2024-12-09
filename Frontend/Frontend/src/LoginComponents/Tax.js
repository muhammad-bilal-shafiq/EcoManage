import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function Tax() {
    const { cid } = useParams();
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    axios.defaults.withCredentials = true;
    const [Tax, setTax] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:4000/Tax/${cid}`, { withCredentials: true })
            .then((res) => {
                if (res.data.Status === 'Success') {
                    setAuth(true);
                    setName(res.data.name);
                    setTax(res.data.emission);
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
                        <h1 className='text-4xl'>Penalty</h1>
                        <div className='flex h-96 '>
                            <div className='w-48 bg-white rounded p-3'>

                                <table className='table border shadow-lg bg-white'>
                                    <thead className='bg-gray-200'>
                                        <tr>
                                            <th className='px-4 py-2'>Cid</th>
                                            <th className='px-4 py-2'>Effective Date</th>
                                            <th className='px-4 py-2'>Emissions Penalty ($)</th>
                                            <th className='px-4 py-2'>Undocumented Disposal Penalty ($)</th>
                                            <th className='px-4 py-2'>Company Scale Tax ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(Tax) && Tax.length > 0 ? (
                                            Tax.map((data, i) => (
                                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                                    <td className='px-4 py-2'>{data.Cid}</td>
                                                    <td className='px-4 py-2'>{data.Effective_Date}</td>
                                                    <td className='px-4 py-2'>{data.Emissions_Tax}</td>
                                                    <td className='px-4 py-2'>{data.Undocumented_Disposal_Tax}</td>
                                                    <td className='px-4 py-2'>{data.CompanyScaleTax}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan='5' className='px-4 py-2 text-center text-gray-500'>
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

export default Tax;
