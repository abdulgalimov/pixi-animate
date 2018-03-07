/**
 * Created by Zaur abdulgalimov@gmail.com on 07.03.2018.
 */


(function(){
  var targets = {
    rotation: 'transform',
    x: 'position',
    y: 'position'
  };
  var names = {
    opacity: 'alpha',
    color: 'tint'
  };
  var invertNames = {};
  for (var key in names) invertNames[names[key]] = key;
  //
  function createTween(self, prop, value, options) {
    var tweens = self._animate.tweens;
    if (!tweens) {
      tweens = self._animate.tweens = {};
    }
    var tween;
    if (!tweens[prop]) {
      tween = PIXI.tweenManager.createTween(self._animate);
      tweens[prop] = tween;
      console.log('prop', prop);
    } else {
      tween = tweens[prop];
      tween.clear();
    }
    var to = {};
    to[prop] = value;
    tween.to(to);
    tween.time = options.time || 1;
    if (options.easing) tween.easing = options.easing;
    tween.start();
  }
  //
  function defObservableProp(self, name, prop, options) {
    var propPrivate = '_'+prop;
    //
    Object.defineProperty(self[name], prop, {
      set: function (value) {
        if (self[name][propPrivate] !== value) {
          createTween(self, name + propPrivate, value, options);
        }
      },
      get: function () {
        return self[name][propPrivate];
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(self._animate, name + propPrivate, {
      set: function (value) {
        self[name][propPrivate] = value;
        self[name].cb.call(self[name].scope);
      },
      get: function () {
        return self[name][propPrivate];
      },
      enumerable: false,
      configurable: true
    });
  }
  //
  PIXI.DisplayObject.prototype.animateDefine = function(name, options) {
    if (!this._animate) {
      Object.defineProperty(this, '_animate', {
        value: {},
        enumerable: false,
        configurable: true
      })
    }
    //
    if (invertNames[name]) name = invertNames[name];
    options = options||{};
    //
    var def = {};
    var originName = names[name] ? names[name] : name;
    if (!(this[originName] instanceof PIXI.ObservablePoint)) {
      var target = !targets[name] ? this : this[targets[name]];
      Object.defineProperty(this, name, {
        set: function (value) {
          if (target[originName] !== value) {
            createTween(this, name, value, options);
          }
        },
        get: function() {
          return target[originName];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(this._animate, name, {
        set: function (value) {
          target[originName] = value;
        },
        get: function () {
          return target[originName];
        },
        enumerable: false,
        configurable: true
      });
    } else {
      var list = ['x', 'y'];
      for (var i = 0; i < list.length; i++) {
        var prop = list[i];
        //
        defObservableProp(this, name, prop, options);
      }
      def = {};
      def.set = {
        value: function(x, y) {
          x = x||0;
          y = y || ((y !== 0) ? x : 0);
          //
          this.x = x;
          this.y = y;
        }
      };
      Object.defineProperties(this[name], def);
    }
  };
  PIXI.DisplayObject.prototype.animateGet = function(name) {
    if (!this._animate || !this._animate.tweens || !this._animate.tweens[name]) return null;
    return this._animate.tweens[name];
  };
  PIXI.DisplayObject.prototype.animateIsActive = function(name) {
    var tween = this.animateGet(name);
    return tween ? tween.active : false;
  }
  PIXI.DisplayObject.prototype.animateStop = function(name) {
    var tween = this.animateGet(name);
    if (tween) tween.stop();
  }
})();
