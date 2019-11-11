let now = new Date()
now.setHours(0,0,0,0)
let daysInMs = 60*60*24*1000

let currDay;
for(let i =0; i<15; i++){
   
    currDay = new Date(now.getTime() -  (daysInMs * i))
    currYesterday = new Date(now.getTime() -  ( daysInMs * (i+1)))
    
}