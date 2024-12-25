import { Link } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPannel = () => {
  const {
    userAuth: { username } , setUserAuth
  } = useContext(UserContext);
  
    const signOut = ()=>{
      removeFromSession("user");
      setUserAuth({acess_token:null})
      
    }
  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      trasition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute right-0 border border-grey w-60  duration-200">
        
{/*  
        <Link to={`/user/${username}`} className="link pl-8 py-4">
          profile
        </Link>
         */}
         <p className="text-slate-700">Username : {username} lodu</p>
        <span className="absolute border-t border-grey  w-[100%]"></span>

        <button className="text-left p hover:bg-grey w-full pl-8 py-4" onClick={signOut}>
          <h1 className="font-bold text-xl mb-1">Sign Out</h1>
          <p className="text-slate-700">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPannel;
