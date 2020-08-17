<template>
  <div id="spinner">
    <button
        class="spin"
        @click="spin"
    >
      Spin
    </button>
    <button @click="test">Click me!</button>
    <canvas ref="canvas" id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: {
    options: {
      type: Array,
      default: function () {
        return ["$100", "$10", "$25", "$250", "$30", "$1000", "$1", "$200", "$45", "$500", "$5", "$20", "Lose", "$1000000", "Lose", "$350", "$5", "$99"]
      }
    },
  },
  data() {
    return {
      rotate: 0,
      startAngle: 0,
      arc: Math.PI / (this.options.length / 2),
      spinTimeout: null,
      spinArcStart: 10,
      spinTime: 0,
      spinTimeTotal: 0,
      spinAngleStart: null,
      ctx: '',
    }
  },
  methods: {
    byte2Hex(n) {
      const nybHexString = "0123456789ABCDEF";
      return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    },
    RGB2Color(r, g, b) {
      return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
    },
    getColor(item, maxItem) {
      const phase = 0;
      const center = 128;
      const width = 127;
      const frequency = Math.PI * 2 / maxItem;

      const red = Math.sin(frequency * item + 2 + phase) * width + center;
      const green = Math.sin(frequency * item  + phase) * width + center;
      const blue = Math.sin(frequency * item + 4 + phase) * width + center;

      return this.RGB2Color(red, green, blue);
    },
    drawRouletteWheel() {
      let canvas = this.$refs.canvas
      if (canvas.getContext) {
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 125;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,500,500);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.font = 'bold 12px Helvetica, Arial';

        for(let i = 0; i < this.options.length; i++) {
          let angle = this.startAngle + i * this.arc;
          //ctx.fillStyle = colors[i];
          ctx.fillStyle = this.getColor(i, this.options.length);

          ctx.beginPath();
          ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
          ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
          ctx.stroke();
          ctx.fill();

          ctx.save();
          ctx.shadowOffsetX = -1;
          ctx.shadowOffsetY = -1;
          ctx.shadowBlur    = 0;
          ctx.shadowColor   = "rgb(220,220,220)";
          ctx.fillStyle = "black";
          ctx.translate(250 + Math.cos(angle + this.arc / 2) * textRadius,
              250 + Math.sin(angle + this.arc / 2) * textRadius);
          ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
          let text = this.options[i];
          ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
          ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();

        this.ctx = ctx;
      }
    },
    spin() {
      this.spinAngleStart = Math.random() * 10 + 10;
      this.spinTime = 0;
      this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
      this.rotateWheel();
    },
    rotateWheel() {
      this.spinTime += 30;
      if(this.spinTime >= this.spinTimeTotal) {
        this.stopRotateWheel();
        return;
      }
      const spinAngle = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
      this.startAngle += (spinAngle * Math.PI / 180);
      this.drawRouletteWheel();
      this.spinTimeout = setTimeout(this.rotateWheel, 30);
    },
    stopRotateWheel() {
      clearTimeout(this.spinTimeout);
      const degrees = this.startAngle * 180 / Math.PI + 90;
      const arcd = this.arc * 180 / Math.PI;
      const index = Math.floor((360 - degrees % 360) / arcd);
      this.ctx.save();
      this.ctx.font = 'bold 30px Helvetica, Arial';
      const text = this.options[index]
      this.ctx.fillText(text, 250 - this.ctx.measureText(text).width / 2, 250 + 10);
      this.ctx.restore();
    },
    easeOut(t, b, c, d) {
      const ts = (t/=d)*t;
      const tc = ts*t;
      return b+c*(tc + -3*ts + 3*t);
    },
    test() {
      
    }
  },
  mounted() {
    this.drawRouletteWheel();
  }
}
</script>

<style scoped>

</style>
