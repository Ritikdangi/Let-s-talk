import React , {createContext, useContext, useState }from 'react'
import Cookies from 'js-cookie';

 const AuthContext = createContext();
function AuthProvider({children}) {
    
     const intialState = Cookies.get("token") || localStorage.getItem("ChatApp");
          // parsing user data and storing in state 

const [authUser , setAuthUser]= useState(intialState? JSON.parse(intialState) : undefined);
          
  return (
   <AuthContext.Provider value={[authUser , setAuthUser]}>
    {children}
   </AuthContext.Provider>
  )
}
 export default AuthProvider; 
 
export const useAuth=()=>{ const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;}
