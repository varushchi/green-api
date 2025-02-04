import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {

  const [input, setInput] = useState({
    idInstance: '',
    apiTokenInstance: ''
  })

  const navigate = useNavigate()

  function handleSubmit(){
    sessionStorage.setItem('apiUrl', `https://${input.idInstance.slice(0, 4)}.api.green-api.com`)
    sessionStorage.setItem('idInstance', input.idInstance)
    sessionStorage.setItem('apiTokenInstance', input.apiTokenInstance)
    navigate('/message')
  }

  return (
    <div className='w-2/5 max-w-[500px] min-w-[300px] h-[100vh] mx-auto grid grid-cols-1 items-center justify-center'>
      <form
        className='w-full flex flex-col gap-[10px]'
        onSubmit={handleSubmit}
      >
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
          placeholder='Instance ID'
          value={input.idInstance}
          onChange={(e) => setInput({...input, idInstance: (e.target.value)})}
        />
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
          placeholder='API Token Instance'
          value={input.apiTokenInstance}
          onChange={(e) => setInput({...input, apiTokenInstance: e.target.value})}
          />
        <button
          type='submit'
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
        >
          Войти</button>
      </form>
    </div>
  )
}
