/**
 * Created by Zaur abdulgalimov@gmail.com on 06.03.2018.
 */


var app;
var bunny;
function start() {
  //
  var options = {
    backgroundColor: 0xffffff,
    width: window.innerWidth,
    height: window.innerHeight
  };
  app = new PIXI.Application(options);
  document.body.style.margin = '0';
  document.body.appendChild(app.view);
  app.ticker.add(function() {
    PIXI.tweenManager.update();
  });
  //
  var back = new PIXI.Graphics();
  back.beginFill(0xeeeeee, 1);
  back.drawRect(0, 0, app.view.width, app.view.height);
  app.stage.addChild(back);
  //
  bunny = new PIXI.Sprite(PIXI.Texture.from('examples/img/bunny.png'));
  bunny.anchor.set(0.5, 0.5);
  bunny.scale.set(2);
  bunny.position.set(back.width/2, back.height/2);
  app.stage.addChild(bunny);
  //
  bunny.animateDefine('position', {
    time: 300,
    easing: PIXI.tween.Easing.outBack()
  });
  bunny.animateDefine('rotation', {
    time: 3000,
    easing: PIXI.tween.Easing.outBack()
  });
  //
  bunny.interactive = true;
  bunny.pointertap = function() {
    if (!bunny.animateIsActive('rotation')) {
      bunny.rotation += -Math.PI + Math.random() * Math.PI * 2;
    } else {
      bunny.animateStop('rotation');
    }
  };
  //
  back.interactive = true;
  back.pointertap = function(e) {
    bunny.x = e.data.global.x;
    bunny.y = e.data.global.y;
  };
}
