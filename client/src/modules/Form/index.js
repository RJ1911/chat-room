import { useState } from "react"
import Button from "../../components/Button"
import Input from "../../components/Input"
import { useNavigate } from "react-router-dom"

export const Form = (
  {
    isSignInPage = false,
  }
) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: ''
    }),
    email: '',
    password: ''
  })

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("data ", data) ====================================================================
    const res = await fetch(`http://localhost:9000/api/${isSignInPage ? 'login' : 'register'}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (res.status === 400) {
      alert("Invalid Credentials.")
    }
    else {

      const resData = await res.json();
      if (resData.token) {
        localStorage.setItem('userToken', resData.token);
        localStorage.setItem('userDetails', JSON.stringify(resData.user));
        // console.log(localStorage.getItem('userToken'));==========================================
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        // console.log(userDetails);=======================================================

        navigate('/');
      }

    }
  }
  return (
    <div className="bg-light h-screen flex items-center justify-center">
      <div className="bg-white h-[700px] w-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="text-4xl font-bold">Welcome {isSignInPage && 'Back'}</div>
        <div className="text-xl font-light mb-14">{isSignInPage ? 'Sign in to explore' : 'Sign up now to get started'}</div>
        <form className="flex flex-col items-center w-full" onSubmit={(e) => handleSubmit(e)}>
          {/* ==========Full Name================================ */}
          {!isSignInPage && <Input onChange={(e) => setData({ ...data, fullName: e.target.value })} label="Full Name" name="name" placeholder="Enter your Full Name" className=" mb-5 w-[50%]" value={data.fullName} />}
          {/* ==========Email================================ */}
          <Input onChange={(e) => setData({ ...data, email: e.target.value })} label="Email" name="email" type="email" placeholder="Enter your Email Address" className="w-[50%] mb-5" value={data.email} />
          {/* ==========Password================================ */}
          <Input onChange={(e) => setData({ ...data, password: e.target.value })} label="Password" name="password" type="password" isRequired={true} placeholder="Enter a Password" className="mb-5 w-[50%]" value={data.password} />
          <Button label={isSignInPage ? "Sign In" : "Sign Up"} type="Submit" className="mt-10 mb-3" />
        </form>
        {/* =========Submit button================================ */}
        <div>{isSignInPage ? "Don't have an account?" : "Already have an account?"} <span className="text-primary cursor-pointer underline"
          onClick={() => navigate(`/user/${isSignInPage ? "sign_up" : "sign_in"}`)}>{isSignInPage ? "Sign Up" : "Sign In"}</span></div>
      </div>
    </div>
  )
}
