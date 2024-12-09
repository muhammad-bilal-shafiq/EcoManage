import React from 'react'
import { Link } from 'react-router-dom'
function Startpage() {
  return (
    <div>

      <section className="bg-gray-50 dark:bg-white">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-5xl font-semibold text-gray-900 dark:text-gray-700">
            <img className="w-12 h-12 mr-2 " src="https://i.pinimg.com/736x/8a/eb/81/8aeb81235a448b1b088a81c75a370653.jpg" alt="logo" />
            Welcome to Eco<p className='text-green-600'> Manage</p>

          </a>
          <p className='text-sky-600  text-2xl font-light bottom-6 relative'>Preserving Earth</p>
          <div className="space-x-4">
  <Link
    to="/adminlogin"
    className='bg-gradient-to-r from-green-700 to-green-900 px-4 py-2 rounded-3xl inline text-white hover:bg-gradient-to-r hover:from-green-900 hover:to-green-700 focus:bg-gradient-to-r focus:from-green-900 focus:to-green-700 transition duration-500'
  >
    Administrator Login
  </Link>

  <Link
    to="/CompanyLogin"
    className='bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 rounded-3xl inline text-white hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-600 focus:bg-gradient-to-r focus:from-blue-800 focus:to-blue-600 transition duration-500'
  >
    Company Login
  </Link>

  <Link
    to="/publicpage"
    className='bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-3xl inline text-white hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 focus:bg-gradient-to-r focus:from-pink-600 focus:to-purple-600 transition duration-500'
  >
    Public Page
  </Link>
</div>




        </div>

      </section>

    </div>
  )
}

export default Startpage