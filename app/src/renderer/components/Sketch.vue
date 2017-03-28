<template>
  <div>
    <canvas ref="canvas" class="decorated" :width="width" :height="height">
    </canvas>
    <div :style="{paddingLeft:width -70 +'px'}">
      <button class="btn btn-danger" @click="clear">Clear</button>
    </div>
  </div>
</template>
<script>
  import Rx from 'rxjs/Rx'
  export default {
    props:{
      width:{
        type:Number,
        default:400
      },
      height:{
        type:Number,
        default:400
      },
      lines:{
        type:Array,
        default:[]
      }
    },
    mounted(){
      let canvasElement = this.$refs.canvas
      let g = canvasElement.getContext("2d")
      this.g = g
      this.draw()
      let mouseMove = Rx.Observable.fromEvent(canvasElement, 'mousemove').map(
        function(ev){
          ev.preventDefault()
          return {
            x: ev.offsetX,
            y: ev.offsetY
          };
        }
      )
      let touchMove = Rx.Observable.fromEvent(canvasElement,'touchmove').map(
        function(ev){
          ev.preventDefault()

          return {
            x:ev.touches[0].pageX - ev.touches[0].target.offsetLeft,
            y:ev.touches[0].pageY - ev.touches[0].target.offsetTop
          }
        }
      )
      let move = Rx.Observable.merge(mouseMove, touchMove)
      let start = Rx.Observable.fromEvent(canvasElement, 'touchstart').merge(
        Rx.Observable.fromEvent(canvasElement, 'mousedown')
      ).map(ev=>{
        ev.preventDefault()
        return ev
      })
      let end = Rx.Observable.fromEvent(canvasElement, 'touchend').merge(
        Rx.Observable.fromEvent(canvasElement, 'mouseleave'),
        Rx.Observable.fromEvent(canvasElement, 'mouseup')
      ).map(ev=>{
        ev.preventDefault()
        return ev
      })
      start.flatMap(function(ev){
        return move.scan((acc, ev)=>acc.concat([ev]), []).takeUntil(end).takeLast(1)
      }).subscribe(events => {
        this.$emit('line', events)
      })
      start.flatMap(function(ev) {
        return move.pairwise().takeUntil(end)
      }).subscribe(function(pos) {
        g.beginPath();
        g.lineWidth = 1;
        g.strokeStyle = "rgb(255, 0, 0)";
        g.moveTo(pos[0].x, pos[0].y);
        g.lineTo(pos[1].x, pos[1].y);
        g.stroke();
      });
    },
    watch:{
      lines(value){
        this.draw()
      }
    },
    methods:{
      clear(){
        this.$emit('clear')
      },
      draw(){
        let g = this.g
        g.beginPath()
        g.rect(0, 0, this.width, this.height)
        g.fillStyle = "rgb(255,255,255)"
        g.fill()
        g.beginPath()
        for(let line of this.lines){
          if(line.length > 1){
            g.lineWidth = 1;
            g.strokeStyle = "rgb(255, 0, 0)"
            for(let i = 0; i < line.length; i++){
              if(i == 0) {
                g.moveTo(line[i].x, line[i].y)
              } else {
                g.lineTo(line[i].x, line[i].y)
              }
            }
          }
        }
        g.stroke()
      }
    }
  }
</script>
<style>
.decorated{
  border:2px dashed rgb(200,200,200);
}
</style>
