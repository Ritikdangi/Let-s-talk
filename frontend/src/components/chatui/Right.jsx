
import Messages from './Messages';
import Showuser from './Showuser';
import Typesend from './Typesend';
function Right() {

  return (
    <div className= 'bg-slate-900 text-white w-[70%] '>
      {/* part 1 */}
     <div className="bg-slate-600  h-[8vh]">
         <Showuser/>
     </div>
 {/* part 2 */}
     <div className="h-[calc(94vh-10vh)] text-white font-semibold overflow-y-auto mx-6 mt-2">
   <Messages/>
     </div>
 {/* part 3 */}
       <div className="">
        <Typesend/>
       </div>
    </div>
  )
}

export default Right
