import Messages from './Messages';
import Showuser from './Showuser';
import Typesend from './Typesend';
function Right() {
  return (
    <div className='bg-slate-900 text-white w-full h-full flex flex-col'>
      {/* Header */}
      <div className="bg-slate-600 min-h-[8vh]">
        <Showuser/>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mx-2 md:mx-6 mt-2">
        <Messages/>
      </div>
      
      {/* Input Area */}
      <div className="min-h-[6vh]">
        <Typesend/>
      </div>
    </div>
  )
}

export default Right
