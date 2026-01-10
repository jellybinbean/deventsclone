import ExploreBtn from "@/components/ExploreBtn"
import Eventcard from "@/components/Eventcard"
import { events } from "@/lib/constants"


const home = () => {
  

  return (
    <section>
      <h1 className="text-center">The Hub For Every Dev <br /> Events you can not miss</h1>    
      <p className="mt-5 text-center">Hackathons, Meetups, and conferences, All in one place</p>
      
      <ExploreBtn/>

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events"> 
          {events.map((event)=>(
            <li key={event.title}>
              <Eventcard {...event} />
            </li>
          ))}
        </ul>  

      </div>
     
    </section>
    
  )
}

export default home