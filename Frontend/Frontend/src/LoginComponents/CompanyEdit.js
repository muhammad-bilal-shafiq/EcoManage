
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Navigate,useNavigate } from 'react-router-dom'

function CompanyEdit() {
        const [Cid,setcid] = useState('')
        const [Cname,setCName] = useState('')
        const [VCode,setVcode] = useState('')
        const [SWaste_Total,setSWaste] = useState('')
        const [Em_Total,setEmTotal] = useState('')
        const [Tax,setTax] = useState('')
        const [Eflag,setEflag] = useState('')
        const [wflag,setwflag] = useState('')
        const [Date_Joined,setdatejoined] = useState('')
        const [SWaste_Disposed,setSWasteDisposed] = useState('')
        const [Area,setArea] = useState('')
        const [Company_Key,setCompanyKey] = useState('')
        const [Last_Month_Check,setlastmonthcheck] = useState('')
        const [Prev_Method_Installed,setprevmethod] = useState('')
        const [CO2,setCO2] = useState('')
        const [NO2,setNO2] = useState('')
        const [CO,setCO] = useState('')
        const [NO,setNO] = useState('')
        const navigate = useNavigate();


        function handleSubmit(event){
            event.preventDefault();
            console.log("form submitted")
            axios.put('http://localhost:4000/CompanyEdit', {Cid, Company_Key, SWaste_Total, Em_Total, SWaste_Disposed, Area, Last_Month_Check,Prev_Method_Installed,CO2,NO2,CO,NO})
            .then(res => {
                navigate('/')
            }).catch(err => console.log(err));
        }


  return (
    <div className='flex h-100 bg-blue-700 justify-center items-center'>
        <div className='w-60 bg-white rounded p-3'> 
            <form onSubmit={handleSubmit}>
                <p className='text-lg font-bold'>Edit Company Data</p>
               
                <div className='mb-2'>
                    <label htmlFor=''>SWaste_Total</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setSWaste(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>Em_Total</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setEmTotal(e.target.value)}/>
                </div>
               
             
                <div className='mb-2'>
                    <label htmlFor=''>SWaste_Disposed</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setSWasteDisposed(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>Area</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setArea(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>Key</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setCompanyKey(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>CO2</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setCO2(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>NO2</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setNO2(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>CO</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setCO(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>NO</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setNO(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>Last_Month_Check</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setlastmonthcheck(e.target.value)}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>Prevention Method</label>
                    <input type='text' placeholder='Enter Name' className='form-control'
                    onChange={e=> setprevmethod(e.target.value)}/>
                </div>
                <button type="submit" className='bg-green-700 text-white'>submit</button>
            </form>
        </div>
    </div>
  )
}

export default CompanyEdit;