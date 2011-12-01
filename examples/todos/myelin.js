(function() {
  var $, Axon, Backbone, Button, Checkbox, Handler, ImmediateInput, Input, Parser, Password, Radio, Submit, View, handlers, isHandlerClass, myelin, previousMyelin, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  root = this;
  previousMyelin = root.myelin;
  if (typeof exports !== 'undefined') {
    myelin = exports;
  } else {
    myelin = root.myelin = {};
  }
  _ = root._;
  if (!_ && (typeof require !== "undefined" && require !== null)) {
    _ = require('underscore')._;
  }
  Backbone = root.Backbone;
  if (!Backbone && (typeof require !== "undefined" && require !== null)) {
    Backbone = require('backbone');
  }
  $ = root.jQuery || root.Zepto;
  myelin.noConflict = function() {
    root.myelin = previousMyelin;
    return this;
  };
  myelin.events = ['blur', 'focus', 'focusin', 'focusout', 'load', 'resize', 'scroll', 'unload', 'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'change', 'select', 'submit', 'keydown', 'keypress', 'keyup', 'error'];
  Handler = (function() {
    function Handler(options) {
      if ((options != null ? options.event : void 0) != null) {
        this.domEvent = options.event;
      }
    }
    Handler.prototype.get = function(el) {
      return el.html();
    };
    Handler.prototype.clean = function(value) {
      return value;
    };
    Handler.prototype.render = function(value) {
      return value;
    };
    Handler.prototype.set = function(el, value) {
      return el.html(value);
    };
    Handler.prototype.domEvent = false;
    Handler.prototype.modelEvent = function(attribute) {
      return "change:" + attribute;
    };
    Handler.prototype.preventDefault = false;
    return Handler;
  })();
  Input = (function() {
    __extends(Input, Handler);
    function Input() {
      Input.__super__.constructor.apply(this, arguments);
    }
    Input.prototype.domEvent = 'change';
    Input.prototype.get = function(el) {
      return el.val();
    };
    Input.prototype.set = function(el, value) {
      return el.val(value);
    };
    return Input;
  })();
  ImmediateInput = (function() {
    __extends(ImmediateInput, Input);
    function ImmediateInput() {
      ImmediateInput.__super__.constructor.apply(this, arguments);
    }
    ImmediateInput.prototype.domEvent = 'keyup';
    return ImmediateInput;
  })();
  Button = (function() {
    __extends(Button, Input);
    function Button() {
      Button.__super__.constructor.apply(this, arguments);
    }
    Button.prototype.get = function(el) {
      return el.data('value');
    };
    Button.prototype.set = function(el, value) {
      return el.data('value', value);
    };
    Button.prototype.domEvent = 'click';
    return Button;
  })();
  Submit = (function() {
    __extends(Submit, Button);
    function Submit() {
      Submit.__super__.constructor.apply(this, arguments);
    }
    Submit.prototype.preventDefault = true;
    return Submit;
  })();
  Checkbox = (function() {
    __extends(Checkbox, Input);
    function Checkbox() {
      Checkbox.__super__.constructor.apply(this, arguments);
    }
    Checkbox.prototype.get = function(el) {
      return el.is(':checked');
    };
    Checkbox.prototype.set = function(el, value) {
      if (value) {
        return el.attr('checked', 'checked');
      } else {
        return el.removeAttr('checked');
      }
    };
    Checkbox.prototype.clean = Boolean;
    Checkbox.prototype.render = Boolean;
    return Checkbox;
  })();
  Radio = (function() {
    __extends(Radio, Input);
    function Radio() {
      Radio.__super__.constructor.apply(this, arguments);
    }
    Radio.prototype.get = function(el) {
      return el.filter(':checked').val();
    };
    Radio.prototype.set = function(el, value) {
      el.removeAttr('checked');
      return el.filter("[value=" + value + "]").attr('checked', 'checked');
    };
    return Radio;
  })();
  Password = (function() {
    __extends(Password, Input);
    function Password() {
      Password.__super__.constructor.apply(this, arguments);
    }
    Password.prototype.clean = function(value) {
      var bcrypt, salt;
      console.log('WARNING: Auto-syncing password.');
      bcrypt = root.bcrypt;
      if (!root.bcrypt) {
        try {
          bcrypt = require('bcrypt');
        } catch (err) {
          console.log('WARNING: failed to hash password.');
          return value;
        }
      }
      salt = bcrypt.gen_salt_sync;
      return bcrypt.encrypt_sync(value, salt);
    };
    return Password;
  })();
  isHandlerClass = function(fn) {
    return (_.isFunction(fn)) && fn.prototype && fn.prototype.constructor && fn.prototype.get && fn.prototype.set && fn.prototype.clean && fn.prototype.render;
  };
  Axon = (function() {
    function Axon(options) {
      if (options == null) {
        options = {};
      }
      this.modelChange = __bind(this.modelChange, this);
      this.domChange = __bind(this.domChange, this);
      this.unbindModel = __bind(this.unbindModel, this);
      this.unbindDom = __bind(this.unbindDom, this);
      this.bindModel = __bind(this.bindModel, this);
      this.bindDom = __bind(this.bindDom, this);
      this.modelEvent = __bind(this.modelEvent, this);
      this.domEvent = __bind(this.domEvent, this);
      this.push = __bind(this.push, this);
      this.assignModel = __bind(this.assignModel, this);
      this.assignScope = __bind(this.assignScope, this);
      this.lazy = __bind(this.lazy, this);
      this.ready = __bind(this.ready, this);
      this.el = __bind(this.el, this);
      this.handler = __bind(this.handler, this);
      this.attribute = __bind(this.attribute, this);
      if (options.attribute) {
        this.attribute = options.attribute;
      }
      if (options.selector) {
        this.selector = options.selector;
      } else {
        this.selector = this.selector(this.attribute);
      }
      if (this.selector === 'this') {
        this.selector = false;
      }
      if (options.handler instanceof Handler) {
        this.handler = options.handler;
      } else if (isHandlerClass(options.handler)) {
        this.handler = new options.handler;
      } else if (options.handler) {
        this.handler = options.handler;
      }
      if (options.handler instanceof Handler && (options.event != null)) {
        this.handler.domEvent = options.event;
      } else if (options.event != null) {
        this.event = options.event;
      }
      this.scope = this.model = null;
    }
    Axon.prototype.selector = function(attribute) {
      return "[name=" + attribute + "]";
    };
    Axon.prototype.attribute = function(el) {
      return el.attr('name');
    };
    Axon.prototype.handler = function(el) {
      var handler, selector, _i, _len, _ref, _ref2;
      _ref = myelin.handlerMap;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref2 = _ref[_i], selector = _ref2[0], handler = _ref2[1];
        if (el.is(selector)) {
          return new handler({
            event: this.event
          });
        }
      }
      return new myelin.defaultHandler({
        event: this.event
      });
    };
    Axon.prototype.el = function() {
      if (!this.scope) {
        throw new Error("Axons can't use elements without scope");
      }
      if (this.selector) {
        return $(this.selector, this.scope);
      } else {
        return $(this.scope);
      }
    };
    Axon.prototype.ready = function() {
      return this.scope && this.model;
    };
    Axon.prototype.lazy = function() {
      var args, attr;
      attr = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (_.isFunction(this[attr])) {
        return this[attr].apply(this, [this.el()].concat(__slice.call(args)));
      } else {
        return this[attr];
      }
    };
    Axon.prototype.assignScope = function(scope) {
      if (_.isEqual(this.scope, scope)) {
        return;
      }
      if (this.scope) {
        this.unbindDom();
      }
      this.scope = scope;
      if (this.scope) {
        return this.bindDom();
      }
    };
    Axon.prototype.assignModel = function(model) {
      if (_.isEqual(this.model, model)) {
        return;
      }
      if (this.model) {
        this.unbindModel();
      }
      this.model = model;
      if (this.model) {
        return this.bindModel();
      }
    };
    Axon.prototype.push = function() {
      var handler, value;
      if (!(this.ready() && this.modelEvent())) {
        return;
      }
      value = this.model.get(this.lazy('attribute'));
      handler = this.lazy('handler', this.event);
      return handler.set(this.el(), handler.render(value));
    };
    Axon.prototype.domEvent = function() {
      var event;
      event = this.lazy('handler', this.event).domEvent;
      if (_.isFunction(event)) {
        return event(this.el());
      } else {
        return event;
      }
    };
    Axon.prototype.modelEvent = function() {
      var event;
      event = this.lazy('handler', this.event).modelEvent;
      if (_.isFunction(event)) {
        return event(this.lazy('attribute'));
      } else {
        return event;
      }
    };
    Axon.prototype.bindDom = function(bind, delegate) {
      var event;
      if (bind == null) {
        bind = 'bind';
      }
      if (delegate == null) {
        delegate = 'delegate';
      }
      event = this.domEvent();
      if (!event) {
        return;
      }
      if (this.selector) {
        return $(this.scope)[delegate](this.selector, event, this.domChange);
      } else {
        return $(this.scope)[bind](event, this.domChange);
      }
    };
    Axon.prototype.bindModel = function(bind) {
      var event;
      if (bind == null) {
        bind = 'bind';
      }
      event = this.modelEvent();
      if (!event) {
        return;
      }
      return this.model[bind](event, this.modelChange);
    };
    Axon.prototype.unbindDom = function() {
      return this.bindDom('unbind', 'undelegate');
    };
    Axon.prototype.unbindModel = function() {
      return this.bindModel('unbind');
    };
    Axon.prototype.domChange = function(e) {
      var data, el, handler, value;
      if (!this.model) {
        return;
      }
      el = $(e.target);
      handler = this.lazy('handler', this.event);
      value = handler.clean(handler.get(el));
      data = {};
      data[this.lazy('attribute')] = value;
      this.model.set(data);
      if (handler.preventDefault) {
        return false;
      }
    };
    Axon.prototype.modelChange = function(model, value) {
      var handler;
      if (!this.scope) {
        return;
      }
      handler = this.lazy('handler', this.event);
      return handler.set(this.el(), handler.render(value));
    };
    return Axon;
  })();
  Parser = (function() {
    function Parser(view) {
      this.view = view;
      this.parsePair = __bind(this.parsePair, this);
      this.parse = __bind(this.parse, this);
      this.normalize = __bind(this.normalize, this);
      this.axons = [];
    }
    Parser.prototype.normalize = function(selector) {
      var eventRegex, match;
      if (__indexOf.call(myelin.events, selector) >= 0) {
        return {
          event: selector,
          selector: false
        };
      }
      eventRegex = RegExp("^((?:" + (myelin.events.join('|')) + ")(?:\\.\\S+)*)\\s+(.*)");
      match = selector.match(eventRegex);
      if (match) {
        return {
          selector: match[2],
          event: match[1]
        };
      } else {
        return {
          selector: selector
        };
      }
    };
    Parser.prototype.parse = function(sync) {
      var key, value;
      if (_.isArray(sync)) {
        _.map(sync, this.parse);
      } else if (sync instanceof Axon) {
        this.axons.push(sync);
      } else if (_.isFunction(sync)) {
        this.parse(sync.call(this.view));
      } else if (_.isString(sync)) {
        this.parsePair(sync, true);
      } else {
        for (key in sync) {
          value = sync[key];
          this.parsePair(key, value);
        }
      }
      return this;
    };
    Parser.prototype.parsePair = function(attr, option) {
      var make, o, _i, _len;
      make = __bind(function(options) {
        if (options == null) {
          options = {};
        }
        options.attribute || (options.attribute = attr);
        return this.axons.push(new myelin.axon(options));
      }, this);
      if (!option) {
        return;
      } else if (option === true) {
        make();
      } else if (_.isArray(option)) {
        for (_i = 0, _len = option.length; _i < _len; _i++) {
          o = option[_i];
          this.parsePair(attr, o);
        }
      } else if (isHandlerClass(option)) {
        make({
          handler: option
        });
      } else if (option instanceof Handler) {
        make({
          handler: option
        });
      } else if (option instanceof Axon) {
        option.attribute = attr;
        this.axons.push(option);
      } else if (_.isFunction(option)) {
        this.parsePair(attr, option.call(this.view, attr));
      } else if (_.isString(option)) {
        make(this.normalize(option));
      } else if (_.isObject(option)) {
        make(option);
      } else {
        throw new Error("Unrecognized sync option for " + attr + ": " + option);
      }
      return this;
    };
    return Parser;
  })();
  View = (function() {
    __extends(View, Backbone.View);
    function View(options) {
      this.link = __bind(this.link, this);
      this.updateAxons = __bind(this.updateAxons, this);      if (options.model) {
        this.model = options.model;
      }
      View.__super__.constructor.apply(this, arguments);
      this.updateAxons();
      this.link();
    }
    View.prototype.updateAxons = function() {
      var axon, _i, _len, _ref;
      _ref = this.axons || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        axon = _ref[_i];
        axon.assignScope(null);
        axon.assignModel(null);
      }
      return this.axons = (new Parser).parse(this.sync).axons;
    };
    View.prototype.link = function(options) {
      var axon, _i, _len, _ref, _results;
      this.model = (options != null ? options.model : void 0) || this.model;
      this.el = (options != null ? options.el : void 0) || this.el;
      _ref = this.axons;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        axon = _ref[_i];
        if (this.el) {
          axon.assignScope(this.el);
        }
        if (this.model) {
          axon.assignModel(this.model);
        }
        _results.push(axon.push());
      }
      return _results;
    };
    return View;
  })();
  myelin.handlerMap = [['input:submit,button:submit', Submit], ['button,input:button', Button], ['input:password', Password], ['input:checkbox', Checkbox], ['input:radio', Radio], ['textarea', ImmediateInput], ['select,input', Input]];
  myelin.defaultHandler = Handler;
  handlers = {
    Handler: Handler,
    Input: Input,
    Button: Button,
    Submit: Submit,
    Checkbox: Checkbox,
    Radio: Radio,
    Password: Password
  };
  _.extend(myelin, handlers);
  myelin.Axon = Axon;
  myelin.axon = Axon;
  myelin.View = View;
}).call(this);
