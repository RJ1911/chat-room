import Avatar from '../../assets/user_dark.png';
import Input from '../../components/Input';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const Dashboard = () => {


    const [conversations, setConversations] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userDetails')));
    const [messages, setMessages] = useState({});
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);

    const [socket, setSocket] = useState(null);

    const messageRef = useRef(null);

    useEffect(() => {
        setSocket(io('http://localhost:9090'));

    }, [])

    useEffect(() => {
        socket?.emit('addUser', user?.id);
        socket?.on('getUsers', users => {
            console.log(" active users : ", users);
        })
        socket?.on('getMessage', data => {
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, { user: data.user, message: data.message }]
            }))
        })
    }, [socket])


    useEffect (() => {
        messageRef?.current?.scrollIntoView({behaviour : 'smooth'});
        
    },[messages?.messages])
    // ===========Fectch Conversations done by logged in user to show on left screen ===============
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
        const fetchConversations = async () => {
            const res = await fetch(`http://localhost:9000/api/conversation/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const resData = await res.json();
            setConversations(resData);
        }
        fetchConversations();
    }, [])

    // ================Fetch Users who have registered to show on right screen ======================================
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`http://localhost:9000/api/users/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const resData = await res.json();
            setUsers(resData);
            // console.log(resData);=========================================================================================
        }
        fetchUsers();
    }, [])

    // ====================Fetch messages of a particualar conversation ======================
    const fetchMessages = async (conversationId, receiver) => {
        const res = await fetch(`http://localhost:9000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });
        const resData = await res.json();
        // console.log("========", resData)=============================================================================
        setMessages({ messages: resData, receiver, conversationId });
    }

    //================Send messages ===========================================
    const sendMessage = async (e) => {

        socket?.emit('sendMessage', {
            senderId: user?.id,
            receiverId: messages?.receiver?.receiverId,
            message,
            conversationId: messages?.conversationId
        })

        const res = await fetch(`http://localhost:9000/api/message`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(
                {
                    conversationId: messages?.conversationId,
                    senderId: user?.id,
                    message,
                    receiverId: messages?.receiver?.receiverId
                }
            )
        });
        const resData = await res.json();
        setMessage('');

    }
    return (
        // ==================Left screen=================================================
        <div className='w-screen h-screen flex overflow-y-hidden '>
            <div className="w-[25%]  bg-secondary" >
                <div className='flex mx-14 items-center my-8'>
                    <div className='border-2 border-primary p-[2px] rounded-full'><img alt='' src={Avatar} width={75} height={75} /></div>
                    <div className='ml-8'>
                        <h3 className='text-2xl'>{user.fullName}</h3>
                        <p className='text-lg font-light'>My Account</p>
                    </div>
                </div>
                <hr />
                <div className='mx-10 px-2 mt-5 mb-0 text-primary text-lg'>Messages</div>
                <div className='mx-10 px-2 mt-5 h-[70%] overflow-y-scroll scrollbar-hide '>
                    <div >
                        {
                            conversations.length > 0 ?
                                conversations.map(({ conversationId, user }) => {
                                    return (
                                        <div className='flex  items-center py-8 border-b border-b-gray-300'>
                                            <div className='flex items-center cursor-pointer' onClick={() => fetchMessages(conversationId, user)}>
                                                <div className='border-2 border-primary p-[2px] rounded-full'><img alt='' src={Avatar} width={40} height={40} /></div>
                                                <div className='ml-6'>
                                                    <h3 className='text-lg text-black font-normal'>{user?.fullName}</h3>
                                                    <p className='text-sm font-light text-gray-500'>{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : <div className='text-center text-lg font-semibold mt-20'>No Conversations</div>
                        }
                    </div>
                </div>
                <hr />
            </div>
            {/* ==========================Middle Screen , Chat Screen========================================== */}
            <div className="w-[50%] bg-white  h-screen flex flex-col items-center">
                {
                    messages?.receiver?.fullName &&
                    <div className='w-[75%] bg-secondary h-[70px] my-5 rounded-full flex items-center px-14 mb-10'>
                        <div className='cursor-pointer'><img alt='' src={Avatar} width={50} height={50} /></div>
                        <div className='ml-6 mr-auto'>
                            <h3 className='text-lg'>{messages?.receiver?.fullName}</h3>
                            <p className='text-sm font-light text-gray-500'>{messages?.receiver?.email}</p>
                        </div>
                        <div className='cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                <line x1="15" y1="9" x2="20" y2="4" />
                                <polyline points="16 4 20 4 20 8" />
                            </svg>
                        </div>
                    </div>
                }

                <div className='w-full h-[75%] shadow-sm scrollbar-hide overflow-y-scroll'>
                    <div className=' p-14'>

                        {
                            messages?.messages?.length > 0 ?
                                messages.messages.map(({ message, user: { id } = {} }) => {
                                    return (
                                        <>
                                            <div className={`max-w-[45%] p-4 break-words mb-6 ${id === user?.id ? 'bg-primary rounded-b-xl rounded-tl-xl ml-auto text-white' : 'bg-secondary rounded-b-xl rounded-tr-xl'
                                                }`}>
                                                {message}
                                            </div>
                                            <div ref={messageRef}></div>
                                        </>

                                    )
                                }) : <div className='text-center text-lg font-semibold mt-24'> No Messages </div>
                        }
                    </div>
                </div>

                {/* ===============Input ============================== */}
                {
                    // messages?.messages?.length > 0 &&
                    <div className='p-14 w-full flex items-center'>
                        <Input className='w-[75%]' inputClassName='p-4 border-0 outline-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline:none' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Type something ...' />
                        <div className={`ml-4 p-3 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="29" height="29" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                                <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
                            </svg>
                        </div>
                        <div className='ml-4 p-3 cursor-pointer bg-light rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width="29" height="29" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <circle cx="12" cy="12" r="9" />
                                <line x1="9" y1="12" x2="15" y2="12" />
                                <line x1="12" y1="9" x2="12" y2="15" />
                            </svg>
                        </div>
                    </div>
                }
            </div>

            {/* ========================== Right Screen ========================================== */}
            <div className="w-[25%] h-screen bg-light overflow-y-hidden ">
                <div className='text-primary text-lg mx-[45%] mt-[10%]'> People </div>
                <div className='mx-10 px-2 mt-5 h-[70%] overflow-y-scroll scrollbar-hide '>
                    <div >
                        {
                            users.length > 0 ?
                                users.map(({ userId, user }) => {

                                    return (
                                        <div className='flex  items-center py-8 border-b border-b-gray-300'>
                                            <div className='flex items-center cursor-pointer' onClick={() => fetchMessages('new', user)}>
                                                <div className='border-2 border-primary p-[2px] rounded-full'><img alt='' src={Avatar} width={40} height={40} /></div>
                                                <div className='ml-6'>
                                                    <h3 className='text-lg text-black font-normal'>{user?.fullName}</h3>
                                                    <p className='text-sm font-light text-gray-500'>{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : <div className='text-center text-lg font-semibold mt-20'>No Conversations</div>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard


 