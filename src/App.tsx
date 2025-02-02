import { useState } from 'react'


function App() {

  const [input, setInput] = useState({
    phoneNumber: '',
    message: ''
  })

  const apiUrl = 'https://1103.api.green-api.com'
  const mediaUrl = 'https://1103.media.green-api.com'
  const idInstance = '1103184862'
  const apiTokenInstance = 'f90039665daf468683904646cfc08d1a4aafc362993b4726b8'

  async function sendMessage(){
    try{
      const res = await fetch(`${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: `${input.phoneNumber}@c.us`, 
          message: input.message,
        })
      })
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res}`);
      }
      const data = await res.json();
    }
    catch (error){
      console.error(error)
    }
  }

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input value={input.phoneNumber} onChange={(e) => setInput({...input, phoneNumber: e.target.value})} type='phone'/>
        <input value={input.message} onChange={(e) => setInput({...input, message: e.target.value})} type='text'/>
        <button onClick={sendMessage}>send</button>
      </form> 
    </div>
    
  )
}

export default App
