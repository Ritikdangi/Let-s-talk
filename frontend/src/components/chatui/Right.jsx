import Messages from './Messages';
import Showuser from './Showuser';
import Typesend from './Typesend';
function Right() {
  return (
    // Use full viewport height so header and input can be fixed in the flex layout
    <div className='bg-slate-900 text-white w-full h-screen flex flex-col'>
      {/* Header - keep as non-scrolling flex-none so it always stays visible */}
      <div className="flex-none bg-slate-600 z-20">
        <div className="min-h-[8vh]">
          <Showuser/>
        </div>
      </div>

      {/* Messages Area - this should be the single scrollable region */}
      <div className="flex-1 overflow-y-auto mx-2 md:mx-6 mt-2">
        <div className="w-full">
          <Messages/>
        </div>
      </div>

      {/* Input Area - fixed at bottom inside the flex column */}
      <div className="flex-none">
        <Typesend/>
      </div>
    </div>
  )
}

export default Right
