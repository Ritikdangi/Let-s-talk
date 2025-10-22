import Messages from './Messages';
import Showuser from './Showuser';
import Typesend from './Typesend';
function Right() {
  return (
    // Use parent's height and allow proper flex overflow control
    <div className='bg-slate-900 text-white w-full h-full flex flex-col min-h-0'>
      {/* Header - keep sticky so it always stays visible */}
      <div className="sticky top-0 z-20 flex-none bg-slate-600">
        <div className="min-h-[8vh]">
          <Showuser />
        </div>
      </div>

      {/* Messages Area - single scrollable region */}
      <div className="flex-1 min-h-0 overflow-y-auto mx-2 md:mx-6 mt-2 pb-24">
        <div className="w-full">
          <Messages />
        </div>
      </div>

      {/* Input Area - sticky at bottom inside the flex column */}
      <div className="sticky bottom-0 z-20 flex-none">
        <Typesend />
      </div>
    </div>
  )
}

export default Right
