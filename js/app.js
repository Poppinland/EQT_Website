// Animated Bokeh Lava Lamp Canvas
const rand = function(min, max) {
  return Math.random() * ( max - min ) + min;
}

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'lighter';
});

let backgroundColors = [ '#000', '#000' ];
let colors = [
  [ '#002aff', "#009ff2" ],
  [ '#0054ff', '#27e49b' ],
  [ '#202bc5' ,'#873dcc' ]
];
let count = 70;
let blur = [ 12, 70 ];
let radius = [ 1, 120 ];

ctx.clearRect( 0, 0, canvas.width, canvas.height );
ctx.globalCompositeOperation = 'lighter';

let grd = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
grd.addColorStop(0, backgroundColors[0]);
grd.addColorStop(1, backgroundColors[1]);
ctx.fillStyle = grd;
ctx.fillRect(0, 0, canvas.width, canvas.height);

let items = [];

while(count--) {
  let thisRadius = rand( radius[0], radius[1] );
  let thisBlur = rand( blur[0], blur[1] );
  let x = rand( -100, canvas.width + 100 );
  let y = rand( -100, canvas.height + 100 );
  let colorIndex = Math.floor(rand(0, 299) / 100);
  let colorOne = colors[colorIndex][0];
  let colorTwo = colors[colorIndex][1];

  ctx.beginPath();
  ctx.filter = `blur(${thisBlur}px)`;
  let grd = ctx.createLinearGradient(x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius);
  grd.addColorStop(0, colorOne);
  grd.addColorStop(1, colorTwo);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.arc( x, y, thisRadius, 0, Math.PI * 2 );
  ctx.closePath();

  let directionX = Math.round(rand(-99, 99) / 100);
  let directionY = Math.round(rand(-99, 99) / 100);

  items.push({
    x: x,
    y: y,
    blur: thisBlur,
    radius: thisRadius,
    initialXDirection: directionX,
    initialYDirection: directionY,
    initialBlurDirection: directionX,
    colorOne: colorOne,
    colorTwo: colorTwo,
    gradient: [ x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius ],
  });
}

function changeCanvas(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let adjX = 2;
  let adjY = 2;
  let adjBlur = 1;

  items.forEach(function(item) {
    if(item.x + (item.initialXDirection * adjX) >= canvas.width && item.initialXDirection !== 0 || item.x + (item.initialXDirection * adjX) <= 0 && item.initialXDirection !== 0) {
      item.initialXDirection = item.initialXDirection * -1;
    }
    if(item.y + (item.initialYDirection * adjY) >= canvas.height && item.initialYDirection !== 0 || item.y + (item.initialYDirection * adjY) <= 0 && item.initialYDirection !== 0) {
      item.initialYDirection = item.initialYDirection * -1;
    }
    if(item.blur + (item.initialBlurDirection * adjBlur) >= radius[1] && item.initialBlurDirection !== 0 || item.blur + (item.initialBlurDirection * adjBlur) <= radius[0] && item.initialBlurDirection !== 0) {
      item.initialBlurDirection *= -1;
    }

    item.x += (item.initialXDirection * adjX);
    item.y += (item.initialYDirection * adjY);
    item.blur += (item.initialBlurDirection * adjBlur);

    ctx.beginPath();
    ctx.filter = `blur(${item.blur}px)`;
    let grd = ctx.createLinearGradient(item.gradient[0], item.gradient[1], item.gradient[2], item.gradient[3]);
    grd.addColorStop(0, item.colorOne);
    grd.addColorStop(1, item.colorTwo);
    ctx.fillStyle = grd;
    ctx.arc( item.x, item.y, item.radius, 0, Math.PI * 2 );
    ctx.fill();
    ctx.closePath();
  });

  window.requestAnimationFrame(changeCanvas);
}

window.requestAnimationFrame(changeCanvas);
ctx.globalCompositeOperation = 'source-over';
// XI Concepts Background
(function ($) {
  // animated hex background
  $(document).ready(function() {
    $('.animated-background').each(function( index ) {
      var cnv = $("<canvas></canvas>").attr("id", "can"+index);

      var colorToUse = $(this).attr('data-color');
      if (colorToUse === 'red') {
        colorRange = ['rgba(206, 23, 41, 0)', 'rgba(193, 23, 43, 0)'];
        strokeColor = 'rgba(206, 23, 41, 1)';
      } else {
        colorRange = ['rgba(245, 245, 245, alp)', 'rgba(229, 229, 229, alp)'];
        strokeColor = 'rgba(245,245,245, 0.5)';
      }

      $(this).prepend(cnv);

      var can = document.getElementById("can"+index);
      var w = can.width = $(this).width(),
        h = can.height = $(this).height(),
        sum = w + h,
        ctx = can.getContext('2d'),

        opts = {
          side: 30,
          picksParTick: 8, //originally 5
          baseTime: 10,
          addedTime: 5,
          colors: colorRange,
          addedAlpha: 1,
          strokeColor: strokeColor,
          hueSpeed: .1,
          repaintAlpha: 1
        },

        difX = Math.sqrt(3) * opts.side / 2,
        difY = opts.side * 3 / 2,
        rad = Math.PI / 6,
        cos = Math.cos(rad) * opts.side,
        sin = Math.sin(rad) * opts.side,

        hexs = [],
        tick = 0;

      function loop() {
        window.requestAnimationFrame(loop);

        tick += opts.hueSpeed;

        ctx.shadowBlur = 0;

        var backColor;
        if (colorToUse === 'red') {
          backColor = 'rgba(232, 28, 47, 0.9)';
        }
        else {
          backColor = 'rgba(225, 225, 225, 0.5)';
        }
        ctx.fillStyle = backColor.replace('alp', opts.repaintAlpha);
        ctx.fillRect(0, 0, w, h);

        for (var i = 0; i < opts.picksParTick; ++i)
          hexs[(Math.random() * hexs.length) | 0].pick();

        hexs.map(function(hex) {
          hex.step();
        });
      }

      function Hex(x, y) {
        this.x = x;
        this.y = y;
        this.sum = this.x + this.y;
        // change between false and true to animate from left to right, or all at once
        this.picked = false;
        this.time = 0;
        this.targetTime = 0;

        this.xs = [this.x + cos, this.x, this.x - cos, this.x - cos, this.x, this.x + cos];
        this.ys = [this.y - sin, this.y - opts.side, this.y - sin, this.y + sin, this.y + opts.side, this.y + sin];
      }
      Hex.prototype.pick = function() {
        this.color = opts.colors[(Math.random() * opts.colors.length) | 0];
        this.picked = true;
        this.time = this.time || 0;
        this.targetTime = this.targetTime || (opts.baseTime + opts.addedTime * Math.random()) | 0;
      }
      Hex.prototype.step = function() {
        var prop = this.time / this.targetTime;

        ctx.beginPath();
        ctx.moveTo(this.xs[0], this.ys[0]);
        for (var i = 1; i < this.xs.length; ++i)
          ctx.lineTo(this.xs[i], this.ys[i]);
        ctx.lineTo(this.xs[0], this.ys[0]);

        if (this.picked) {
          ++this.time;

          if (this.time >= this.targetTime) {
            this.time = 0;
            this.targetTime = 0;
            this.picked = false;
          }

          var alpha = Math.sin(prop * Math.PI);
          ctx.fillStyle = ctx.shadowColor = this.color.replace('alp', alpha);
          ctx.fill();
        } else {
          var alpha = 0.3; // 透明度を設定（0から1の間の値）
          ctx.strokeStyle = ctx.shadowColor = opts.strokeColor.replace('alp', alpha);
          ctx.stroke();
        }
      }

      for (var x = 0; x < w; x += difX * 2) {
        var i = 0;

        for (var y = 0; y < h; y += difY) {
          ++i;
          hexs.push(new Hex(x + difX * (i % 2), y));
        }
      }
      loop();

      window.addEventListener('resize', function() {
        w = can.width = window.innerWidth;
        h = can.height = window.innerHeight;
        sum = w + h;

        if (can.width < window.innerWidth) {
          can.alpha = 0.5;
          can.opacity = 0.5;
        }

        hexs.length = 0;
        for (var x = 0; x < w; x += difX * 2) {
          var i = 0;

          for (var y = 0; y < h; y += difY) {
            ++i;
            hexs.push(new Hex(x + difX * (i % 2), y));
          }
        }
      });
    });
  });
})(jQuery);

$('header nav a[href^="#"]').click(function () {
  var elmHash = $(this).attr('href');
  var targetSection = $(elmHash);
  var pos = targetSection.offset().top - ($(window).height() - targetSection.outerHeight()) / 2;
  $('body,html').animate({scrollTop: pos}, 500);
  return false;
});

window.addEventListener('load', function() {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';
});

var arr = []
function TypingInit() {
  $('.js_typing').each(function (i) {
    arr[i] = new ShuffleText(this);
  });
}

function TypingAnime() {
  $(".js_typing").each(function (i) {
    var elemPos = $(this).offset().top - 50;
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight) {
      if(!$(this).hasClass("endAnime")){
        arr[i].start();
        arr[i].duration = 800;
        $(this).addClass("endAnime");
      }
    }else{
      $(this).removeClass("endAnime");
    }
  });
}

$(window).scroll(function () {
  TypingAnime();
});


$(window).on('load', function () {
  TypingInit();
  TypingAnime();
});
