import React from 'react'
import Left from '../components/chatui/Left'
import Right from '../components/chatui/Right'
function Dashboard() {
     
  return (

     <div className='flex h-screen w-screen flex-row'>
    <Left/>
    <Right />
</div> 
  )
}

export default Dashboard
