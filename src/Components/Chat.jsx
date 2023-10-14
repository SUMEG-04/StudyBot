import React, { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate=useNavigate()
  const [message, setMessage] = useState('');
  const [chat,setChat]=useState([])
  const userChat=async()=>{
    try{
      const res=await fetch('/getdata',{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      })

      const data=await res.json()
      setChat(data.chat)
      console.log(chat)
      if(!res.status===200){
        const error=new Error(res.error)
        throw error
      }
      
    }catch(err){
      console.log(err)
      navigate('/login')
    }
  }
  useEffect(()=>{
    userChat();
  },[])
  const handleSendMessage = async() => {
    if (message.trim() === '') {
      return; // Prevent sending empty messages
    }

    try {
        const res= await fetch('/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: message,
            assistant:"hello"
          }),
        })
        const data=await res.json()
        if (!data) {
          console.log('Failed to send the message');
        } else {
          alert("user message send")
          userChat()
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div className="container">
      <div className="chat">
      {chat.map((message, index) => (
        <div key={index} className={`message user`}>
          <p className="user_msg">user: <span>{message.user}</span></p>
          <p className="ai_msg">assistant: <span>{message.assitant}</span></p>
        </div>
         ))}

      </div>
      <div className="input-container d-flex justify-content-center p-3 mt-1 mb-1">
        <input
          type="text"
          className="form-control col-lg-6"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary col-lg-1" onClick={handleSendMessage}>
          <SendIcon/>
        </button>
      </div>
    </div>
  );
};

export default Chat;
