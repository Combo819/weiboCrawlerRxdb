import {AsyncQueue} from 'async'
import {Task} from '../../crawler'


export default class TimeWindow{
    private q: AsyncQueue<Task<Object>>;
    private processingItems:number;
    private timeLength:number;
    private maxItems:number;
   /**
    * requesting flow controller. limit the items than can be proceeded in a time window
    * @param q the queue
    * @param timeLength the time window length, in s
    * @param maxItems the max number of items can be proceeded in the time window
    */
    constructor(q: AsyncQueue<Task<Object>>,timeLength:number,maxItems:number){
        this.q =q;
        this.processingItems = 0;
        this.timeLength = timeLength*1000;
        this.maxItems = maxItems;
    }
    
    execute():void{
        this.increase();
        setTimeout(() => {
            this.decrease();
        }, this.timeLength);
    }
    private increase():void{
        this.processingItems=this.processingItems+1;
        console.log('queue increases',this.processingItems,this.maxItems)
        if(this.processingItems>this.maxItems){
            console.log('API requesting pauses')
            this.q.pause();
        }
    }
    private decrease():void{
        this.processingItems = this.processingItems-1;
        console.log('queue decreases',this.processingItems,this.maxItems)
        if(this.processingItems<=this.maxItems){
            console.log('API requesting resumes')
            this.q.resume();
        }
    }

}