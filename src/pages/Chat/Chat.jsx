// import {useState,useEffect} from "react";
// import {io} from "socket.io-client";
// import {useAuth} from "../../context/AuthContext";


// const socket = io(
//  "http://localhost:5000"
// );


// function Chat(){

// const {user}=useAuth();

// const [message,setMessage]=useState("");

// const [conversationId,setConversationId]=useState(null);



// const sendMessage=()=>{

//  if(!message.trim()) return;


//  socket.emit(
//   "send_message",
//   {
//    conversationId,
//    sender:"customer",
//    message
//   }
//  );


//  setMessage("");

// }



// return(

// <div>

// <h2>
// Chat with DevVerse
// </h2>


// <input
//  value={message}
//  onChange={
//  e=>setMessage(e.target.value)
//  }
// />


// <button
//  onClick={sendMessage}
// >
// Send Message
// </button>


// </div>

// )

// }

// export default Chat;