import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChatType } from '../types'
import Chat from '../components/Chat'


function SendMessage() {

  const params = useParams<{phoneNumber : string}>()

  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatType[]>([])
  const [receiptId, setReceiptId] = useState(0)

  const intervalRef = useRef<number | null>(null)

  const apiDataRef = useRef({
    apiUrl: sessionStorage.getItem('apiUrl'),
    idInstance: sessionStorage.getItem('idInstance'),
    apiTokenInstance: sessionStorage.getItem('apiTokenInstance'),
  });

  async function deleteNotification(){
    const { apiUrl, idInstance, apiTokenInstance } = apiDataRef.current;
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
    const { apiUrl, idInstance, apiTokenInstance } = apiDataRef.current;
    try{
      const res = await fetch(`${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: `${params.phoneNumber}@c.us`, 
          message: message,
        })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setChatHistory((prev) => [
        ...prev,
        {
          body: message,
          subject: 'outgoing',
          id: data.idMessage || '',
          time: getTime()
        }])
    }
    catch (error){
      console.error(error)
      setChatHistory((prev) => [
        ...prev,
        {
          body: error instanceof Error ? error.message : "Unknown error",
          subject: 'error',
          id: `error-${Date.now()}`,
          time: getTime()

        }
      ])
    }finally{
      setMessage('')
    }
  }

  async function handleReceiveMessage() {
    const { apiUrl, idInstance, apiTokenInstance } = apiDataRef.current;
    try{
      const res = await fetch(`${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json()
      console.log(data)
      if (data){
        if (data.body.typeWebhook === 'incomingMessageReceived' && data.body.senderData.chatId === `${params.phoneNumber}@c.us`){
          setChatHistory((prev) => [
            ...prev,
            {
              body:data.body.messageData.textMessageData.textMessage || '',
              subject: 'incoming', id: data.body.idMessage || '',
              time: getTime(data.body.timestamp)
            }])
        }
        setReceiptId(() => data.receiptId)
      }
    }catch(error){
      console.error(error)
      setChatHistory((prev) => [
        ...prev,
        {
          body: error instanceof Error ? error.message : "Unknown error",
          subject: 'error',
          id: `error-${Date.now()}`,
          time: getTime()
        }
      ])
    }
  }

  function getTime(timestamp?: number) {
    const date = timestamp ? new Date(timestamp * 1000) : new Date()
    const hours = date.getHours().toString()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  useEffect(() => {
    deleteNotification()
  }, [receiptId])

  useEffect(() => {
    handleReceiveMessage()
    intervalRef.current = setInterval(handleReceiveMessage, 10000)
    return(() => {
      if (intervalRef.current){
        clearInterval(intervalRef.current)
      }
    })
  }, [])


  return (
    <div className='h-full w-full flex flex-col justify-end px-[30px] gap-[20px] relative bg-stone-50 pb-[20px]'>
      <Link className='absolute top-5 right-7' to={'/message'}><button>Close</button></Link>
      <div className='flex flex-col w-4/5 gap-[5px]'>
        {chatHistory.map(elem => {
          return(
            <Chat {...elem} key={elem.id}/>
          )
        })}
      </div>
      <form onSubmit={handleSendMessage} className='flex justify-between'>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='write message...'
          className="w-4/5"
        />
        <button
          type='submit'
        >send</button>
      </form> 
    </div>
    
  )
}

export default SendMessage