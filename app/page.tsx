import ExploreBtn from "@/components/ExploreBtn"
import Eventcard from "@/components/Eventcard"
import { IEvent } from "@/database"
import { cacheLife } from "next/cache"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const home = async () => {
  "use cache"
  cacheLife("hours");

  const response = await fetch(`${BASE_URL}/api/events`)
  const {events} = await response.json();
  return (
    <section>
      <h1 className="text-center">The Hub For Every Dev <br /> Events you can not miss</h1>    
      <p className="mt-5 text-center">Hackathons, Meetups, and conferences, All in one place</p>
      
      <ExploreBtn/>

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events"> 
          {events && events.length > 0 && events.map((event:IEvent)=>(
            <li key={event.title} className="list-none">
              <Eventcard {...event} />
            </li>
          ))}
        </ul>  

      </div>
     
    </section>
    
  )
}

export default home