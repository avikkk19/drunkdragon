import React, { useContext } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import InputBox from "../components/inputBox";
import googleIcon from "../imgs/google.png";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/Firebase";

const UserAuthForm = ({ type }) => {
  const serverRoute = type === "signin" ? "/signin" : "/signup";
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

const userAuthThroughServer = (serverRoute, formData) => {
  axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
    .then(({ data }) => {
      storeInSession("user", JSON.stringify(data)); // Store user data in session
      setUserAuth(data); // Update the user authentication state

      // Redirect to home after successful login
      if (data.access_token) {
        // You could use Navigate here if you want to manually redirect
        // But if you're using a hook like useNavigate(), it's cleaner
        // setUserAuth sets the state, so you can rely on that to trigger a re-render and navigation
        toast.success("Login successful! Redirecting...");
        // A simple redirect example:
        window.location.href = "/"; // Redirect to home using native JavaScript if needed
      }
    })
    .catch(({ response }) => {
      toast.error(response?.data?.error || "Something went wrong!");
      console.log("Error response:", response);
    });
};

  const handleSubmit = (e) => {
    e.preventDefault();

    // Regex patterns
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    // Collect form data
    let form = new FormData(e.target);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    // Fullname validation
    if (fullname && (fullname.length < 3 || fullname.length > 20)) {
      return toast.error("Fullname must be between 3 and 20 characters");
    }

    // Email validation
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email");
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be between 6 and 20 characters and contain at least one lowercase letter, one uppercase letter, and one digit."
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  // Google authentication
  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";
        let formData = {
          access_token: user.accessToken,
        };

        // Call the server for Google authentication
        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("Trouble signing in through Google");
        console.log(err);
      });
  };
   const location = useLocation();
 return access_token && !["/signin", "/signup"].includes(location.pathname) ? (
   <Navigate to="/" />
 ) : (
   <AnimationWrapper keyValue={type}>
     <section className="h-cover flex items-center justify-center">
       <Toaster />
       <form
         id="formElement"
         className="w-[80%] max-w-[400px]"
         onSubmit={handleSubmit}
       >
         <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
           {type === "signin" ? "Welcome Back" : "Register Now"}
         </h1>
         {type !== "signin" && (
           <InputBox
             name="fullname"
             type="text"
             placeholder="Full Name"
             icon="fi-rr-user"
           />
         )}
         <InputBox
           name="email"
           type="email"
           placeholder="Email"
           icon="fi-rr-envelope"
           
         />
         <InputBox
           name="password"
           type="password"
           placeholder="Password"
           icon="fi-rr-key"
         />

         <button className="btn-dark center mt-14" type="submit">
           {type.replace(" ", " $ ")}
         </button>
         <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
           <h1 className="w-1/2 border-black" />
         </div>
         <button
           className=" bg-lime-300 flex items-center justify-center gap-4 w-[90%] center rounded-lg py-2"
           onClick={handleGoogleAuth}
         >
           <img src={googleIcon} alt="google" className="w-5" />
           continue with google
         </button>

         {type === "signin" ? (
           <p className="mt-6  text-slate-800 text-xl text-center">
             Don't have an account?
             <Link to="/signup" className="underline text-black text-xl ml-1">
               Join Us
             </Link>
           </p>
         ) : (
           <p className="mt-6  text-slate-800 text-xl text-center">
             Already a member?
             <Link to="/signin" className="underline text-black text-xl ml-1">
               Sign In
             </Link>
           </p>
         )}
       </form>
     </section>
   </AnimationWrapper>
 );
};

export default UserAuthForm;
