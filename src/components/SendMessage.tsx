import React, { useEffect, useState } from 'react'
import { ChatType } from '../types'
import Chat from './Chat'


function SendMessage() {

  const [input, setInput] = useState({
    phoneNumber: '',
    message: ''
  })

  const [chatHistory, setChatHistory] = useState<ChatType[]>([])

  const [receiptId, setReceiptId] = useState(1)

  const apiUrl = sessionStorage.getItem('apiUrl')
  const idInstance = sessionStorage.getItem('idInstance')
  const apiTokenInstance = sessionStorage.getItem('apiTokenInstance')

  async function deleteNotification(){
    try{
      const res = await fetch(`${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res}`);
      }
    }catch (error){
      console.error(error)
    }

  }

  async function handleSendMessage(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
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
    }
    catch (error){
      console.error(error)
    }finally{
      setChatHistory([...chatHistory, {body: input.message, subject: 'outgoing'}])
      
      setInput({...input, message: ''})
    }
  }

  async function handleReceiveMessage() {
    try{
      const res = await fetch(`${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json()
      console.log(data)

      if (data){
        if (data.body.typeWebhook === 'incomingMessageReceived'){
          setChatHistory([...chatHistory, {body: data.body.messageData.textMessageData.textMessage || '', subject: 'incoming'}])

        }
        setReceiptId(data.receiptId)
      }

    }catch(error){
      console.error(error)
    }finally{
    }
  }

  useEffect(() => {
    deleteNotification()
  }, [receiptId])

  // setInterval(() => handleReceiveMessage(), 10000)

  return (
    <div>
      <form onSubmit={handleSendMessage}>
        <input value={input.phoneNumber} onChange={(e) => setInput({...input, phoneNumber: e.target.value})} type='phone'/>
        <input value={input.message} onChange={(e) => setInput({...input, message: e.target.value})} type='text'/>
        <button type='submit'>send</button>
      </form> 

      <button onClick={handleReceiveMessage}>Recieve</button>


      <div className='flex flex-col'>
        {chatHistory.map(elem => {
          return(
            <Chat {...elem}/>
          )
        })}
      </div>
    </div>
    
  )
}

export default SendMessage