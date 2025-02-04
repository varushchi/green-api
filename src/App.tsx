
import  React, { useState } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'


function App() {

  const [chats, setChats] = useState<string[]>([])
  const [showInput, setShowInput] = useState(false)
  const [input, setInput] = useState('')

  const params = useParams<{phoneNumber: string}>()
  const navigate = useNavigate()

  const chatElem = chats.length > 0 ? chats.map(elem => {
    return(
      <NavLink
        to={`/message/${elem}`}
        className={({isActive}) => {
          return `${isActive && 'bg-gray-100'} w-full h-[60px] flex justify-around items-center`
        }}
        key={elem}
        >
        <p className='text-lg'>{elem}</p>
        <button
          id={elem}
          onClick={handleDelete}
          className="w-1/3"
        >delete</button>
      </NavLink>
    )
  }) : <p className='text-lg'>No chats</p>

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    e.stopPropagation()
    const id = e.currentTarget.id
    setChats(() => {
      return(
        [...chats].filter(elem => elem != id)
      )
    })
    if (params.phoneNumber === id){
      navigate('/message')
    }
  }

  function handleAdd(){
    if (chats.length < 2){
      setChats([input, ...chats])
    }
    else{
      alert('Only 2 numbers')
    }
    setInput('')
    setShowInput(false)
  }
  function handleBack(){
    setShowInput(false)
    setInput('')
  }

  return (
    <div className='flex w-4/5 mx-auto p-[10px] h-[100vh]'>
      <div className='w-1/3 max-w-[450px] border-[1px] border-gray-400 flex flex-col pt-[10px] items-center bg-white'>
        <div className='w-full pb-[30px]'>
          {!showInput && <button
                            onClick={() => setShowInput(true)}
                            className="w-full"
                          >New chat</button>}
          {showInput && 
            <div className='w-full flex justify-around items-center'>
              <input
                type='tel'
                value={input} onChange={(e) => setInput(e.target.value)}
                className="w-2/3"
              />
              <button onClick={handleAdd}>&#9745;</button>
              <button onClick={handleBack}>&#9746;</button>
            </div>
          }
        </div>
        {chatElem}
      </div>
      <div className='w-2/3'>
        <Outlet key={params.phoneNumber}/>
      </div>
    </div>
    
  )
}

export default App
