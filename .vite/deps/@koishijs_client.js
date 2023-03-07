import {
  START_LOCATION_NORMALIZED,
  createRouter,
  createWebHistory
} from "./chunk-C67OIUB6.js";
import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  installer
} from "./chunk-2L3GJZXM.js";
import {
  resolveUnref,
  useLocalStorage
} from "./chunk-5GM7DXJ6.js";
import {
  Comment,
  Fragment,
  Text,
  defineComponent,
  h,
  markRaw,
  reactive,
  ref,
  resolveComponent,
  watch,
  withDirectives
} from "./chunk-P2FA5UP5.js";
import "./chunk-FXSMT4ZS.js";
import {
  marked
} from "./chunk-C6MKFA2W.js";
import {
  require_lib
} from "./chunk-DOEJWRST.js";
import {
  __export,
  __publicField,
  __toESM
} from "./chunk-Y4AOG3KG.js";

// node_modules/@koishijs/client/client/data.ts
function createStorage(key, version, fallback) {
  const storage = useLocalStorage("koishi.console." + key, {});
  const initial = fallback ? fallback() : {};
  if (storage.value.version !== version) {
    storage.value = { version, data: initial };
  } else if (!Array.isArray(storage.value.data)) {
    storage.value.data = { ...initial, ...storage.value.data };
  }
  return reactive(storage.value["data"]);
}
var useStorage = (key, version, fallback) => {
  const initial = fallback ? fallback() : {};
  initial["__version__"] = version;
  const storage = useLocalStorage("koishi.console." + key, initial);
  if (storage.value["__version__"] !== version) {
    storage.value = initial;
  }
  return storage;
};
function provideStorage(factory) {
  useStorage = factory;
}
var config = KOISHI_CONFIG;
var store = reactive({});
var socket = ref(null);
var listeners = {};
var responseHooks = {};
function send(type, ...args) {
  if (!socket.value)
    return;
  const id = Math.random().toString(36).slice(2, 9);
  socket.value.send(JSON.stringify({ id, type, args }));
  return new Promise((resolve, reject) => {
    responseHooks[id] = [resolve, reject];
    setTimeout(() => {
      delete responseHooks[id];
      reject(new Error("timeout"));
    }, 6e4);
  });
}
function receive(event, listener) {
  listeners[event] = listener;
}
receive("data", ({ key, value }) => {
  store[key] = value;
});
receive("patch", ({ key, value }) => {
  if (Array.isArray(store[key])) {
    store[key].push(...value);
  } else {
    Object.assign(store[key], value);
  }
});
receive("response", ({ id, value, error }) => {
  if (!responseHooks[id])
    return;
  const [resolve, reject] = responseHooks[id];
  delete responseHooks[id];
  if (error) {
    reject(error);
  } else {
    resolve(value);
  }
});
function connect(callback) {
  const value = callback();
  value.addEventListener("message", (ev) => {
    const data = JSON.parse(ev.data);
    console.debug("%c", "color:purple", data.type, data.body);
    if (data.type in listeners) {
      listeners[data.type](data.body);
    }
  });
  value.addEventListener("close", () => {
    socket.value = null;
    for (const key in store) {
      store[key] = void 0;
    }
    console.log("[koishi] websocket disconnected, will retry in 1s...");
    setTimeout(() => {
      connect(callback).then(location.reload, () => {
        console.log("[koishi] websocket disconnected, will retry in 1s...");
      });
    }, 1e3);
  });
  return new Promise((resolve, reject) => {
    value.addEventListener("open", (event) => {
      socket.value = markRaw(value);
      resolve(event);
    });
    value.addEventListener("error", reject);
  });
}

// node_modules/marked-vue/lib/index.mjs
var import_xss = __toESM(require_lib(), 1);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var allowedTags = [
  // Content sectioning
  "address",
  "article",
  "aside",
  "footer",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hgroup",
  "main",
  "nav",
  "section",
  // Text content
  "blockquote",
  "dd",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "hr",
  "li",
  "main",
  "ol",
  "p",
  "pre",
  "ul",
  // Inline text semantics
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
  // Table content
  "caption",
  "col",
  "colgroup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr"
];
var voidTags = ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"];
var allowedProtocols = ["http:", "https:", "mailto:", "tel:"];
function checkUrl(value) {
  try {
    const url = new URL(value, location.toString());
    return allowedProtocols.includes(url.protocol);
  } catch (e) {
    return false;
  }
}
__name(checkUrl, "checkUrl");
function sanitize(html) {
  const whiteList = {
    ...Object.fromEntries(allowedTags.map((tag) => [tag, []]))
  };
  const stack = [];
  html = (0, import_xss.filterXSS)(html, {
    whiteList,
    stripIgnoreTag: true,
    onTag(tag, raw, options) {
      let html2;
      if (tag === "a" && !options.isClosing) {
        const attrs = {};
        (0, import_xss.parseAttr)(raw.slice(3), (name, value) => {
          if (name === "href") {
            attrs[name] = checkUrl(value) ? value : "#";
          } else if (name === "title") {
            attrs[name] = (0, import_xss.escapeAttrValue)(value);
          }
          return "";
        });
        attrs.rel = "noopener noreferrer";
        attrs.target = "_blank";
        html2 = `<a ${Object.entries(attrs).map(([name, value]) => `${name}="${value}"`).join(" ")}>`;
      }
      if (raw.endsWith("/>") || voidTags.includes(tag))
        return;
      if (!options.isClosing) {
        stack.push(tag);
        return html2;
      }
      let result = "";
      while (stack.length) {
        const last = stack.pop();
        if (last === tag) {
          return result + raw;
        }
        result += `</${last}>`;
      }
      return raw.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  });
  while (stack.length) {
    const last = stack.pop();
    html += `</${last}>`;
  }
  return html;
}
__name(sanitize, "sanitize");
var src_default = defineComponent({
  props: {
    source: String,
    inline: Boolean,
    tag: String,
    unsafe: Boolean
  },
  setup(props) {
    let html = props.inline ? marked.parseInline(props.source || "") : marked.parse(props.source || "");
    if (!props.unsafe)
      html = sanitize(html);
    return () => {
      const tag = props.tag || (props.inline ? "span" : "div");
      return h(tag, {
        class: "markdown",
        innerHTML: html
      });
    };
  }
});

// node_modules/@koishijs/client/client/components/common/index.ts
import Button from "D:/company/cat/node_modules/@koishijs/client/client/components/common/k-button.vue";
import Filter from "D:/company/cat/node_modules/@koishijs/client/client/components/common/k-filter.vue";
import FilterButton from "D:/company/cat/node_modules/@koishijs/client/client/components/common/k-filter-button.vue";
import Form from "D:/company/cat/node_modules/@koishijs/client/client/components/common/k-form.vue";
import Tab from "D:/company/cat/node_modules/@koishijs/client/client/components/common/k-tab.vue";
function common_default(app) {
  app.component("k-button", Button);
  app.component("k-filter", Filter);
  app.component("k-filter-button", FilterButton);
  app.component("k-form", Form);
  app.component("k-tab", Tab);
}

// node_modules/schemastery-vue/src/index.ts
import Schema from "D:/company/cat/node_modules/schemastery-vue/src/schema.vue";

// node_modules/schemastery-vue/src/icons/index.ts
import IconClose from "D:/company/cat/node_modules/schemastery-vue/src/icons/close.vue";
import IconEllipsis from "D:/company/cat/node_modules/schemastery-vue/src/icons/ellipsis.vue";
import IconExternal from "D:/company/cat/node_modules/schemastery-vue/src/icons/external.vue";
import IconEyeSlash from "D:/company/cat/node_modules/schemastery-vue/src/icons/eye-slash.vue";
import IconEye from "D:/company/cat/node_modules/schemastery-vue/src/icons/eye.vue";

// node_modules/cosmokit/lib/index.mjs
var __defProp2 = Object.defineProperty;
var __name2 = (target, value) => __defProp2(target, "name", { value, configurable: true });
function noop() {
}
__name2(noop, "noop");
function isNullable(value) {
  return value === null || value === void 0;
}
__name2(isNullable, "isNullable");
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
__name2(isPlainObject, "isPlainObject");
function valueMap(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
__name2(valueMap, "valueMap");
function is(type, value) {
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
__name2(is, "is");
function clone(source) {
  if (!source || typeof source !== "object")
    return source;
  if (Array.isArray(source))
    return source.map(clone);
  if (is("Date", source))
    return new Date(source.valueOf());
  if (is("RegExp", source))
    return new RegExp(source.source, source.flags);
  return valueMap(source, clone);
}
__name2(clone, "clone");
function deepEqual(a, b, strict) {
  if (a === b)
    return true;
  if (!strict && isNullable(a) && isNullable(b))
    return true;
  if (typeof a !== typeof b)
    return false;
  if (typeof a !== "object")
    return false;
  if (!a || !b)
    return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length)
      return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  } else if (Array.isArray(b)) {
    return false;
  }
  return Object.keys({ ...a, ...b }).every((key) => deepEqual(a[key], b[key]));
}
__name2(deepEqual, "deepEqual");
function pick(source, keys, forced) {
  if (!keys)
    return { ...source };
  const result = {};
  for (const key of keys) {
    if (forced || key in source)
      result[key] = source[key];
  }
  return result;
}
__name2(pick, "pick");
function omit(source, keys) {
  if (!keys)
    return { ...source };
  const result = { ...source };
  for (const key of keys) {
    Reflect.deleteProperty(result, key);
  }
  return result;
}
__name2(omit, "omit");
function defineProperty(object, key, value) {
  return Object.defineProperty(object, key, { writable: true, value });
}
__name2(defineProperty, "defineProperty");
function contain(array1, array2) {
  return array2.every((item) => array1.includes(item));
}
__name2(contain, "contain");
function intersection(array1, array2) {
  return array1.filter((item) => array2.includes(item));
}
__name2(intersection, "intersection");
function difference(array1, array2) {
  return array1.filter((item) => !array2.includes(item));
}
__name2(difference, "difference");
function union(array1, array2) {
  return Array.from(/* @__PURE__ */ new Set([...array1, ...array2]));
}
__name2(union, "union");
function deduplicate(array) {
  return [...new Set(array)];
}
__name2(deduplicate, "deduplicate");
function remove(list, item) {
  const index = list.indexOf(item);
  if (index >= 0) {
    list.splice(index, 1);
    return true;
  } else {
    return false;
  }
}
__name2(remove, "remove");
function makeArray(source) {
  return Array.isArray(source) ? source : isNullable(source) ? [] : [source];
}
__name2(makeArray, "makeArray");
function arrayBufferToBase64(buffer) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(buffer).toString("base64");
  }
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
__name2(arrayBufferToBase64, "arrayBufferToBase64");
function base64ToArrayBuffer(base64) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").buffer;
  }
  const binary = atob(base64.replace(/\s/g, ""));
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}
__name2(base64ToArrayBuffer, "base64ToArrayBuffer");
function capitalize(source) {
  return source.charAt(0).toUpperCase() + source.slice(1);
}
__name2(capitalize, "capitalize");
function uncapitalize(source) {
  return source.charAt(0).toLowerCase() + source.slice(1);
}
__name2(uncapitalize, "uncapitalize");
function camelCase(source) {
  return source.replace(/[_-][a-z]/g, (str) => str.slice(1).toUpperCase());
}
__name2(camelCase, "camelCase");
function paramCase(source) {
  return uncapitalize(source).replace(/_/g, "-").replace(/.[A-Z]+/g, (str) => str[0] + "-" + str.slice(1).toLowerCase());
}
__name2(paramCase, "paramCase");
function snakeCase(source) {
  return uncapitalize(source).replace(/-/g, "_").replace(/.[A-Z]+/g, (str) => str[0] + "_" + str.slice(1).toLowerCase());
}
__name2(snakeCase, "snakeCase");
var camelize = camelCase;
var hyphenate = paramCase;
function trimSlash(source) {
  return source.replace(/\/$/, "");
}
__name2(trimSlash, "trimSlash");
function sanitize2(source) {
  if (!source.startsWith("/"))
    source = "/" + source;
  return trimSlash(source);
}
__name2(sanitize2, "sanitize");
var Time;
((Time2) => {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = new Date().getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  __name2(setTimezoneOffset, "setTimezoneOffset");
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  __name2(getTimezoneOffset, "getTimezoneOffset");
  function getDateNumber(date = new Date(), offset) {
    if (typeof date === "number")
      date = new Date(date);
    if (offset === void 0)
      offset = timezoneOffset;
    return Math.floor((date.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  __name2(getDateNumber, "getDateNumber");
  function fromDateNumber(value, offset) {
    const date = new Date(value * Time2.day);
    if (offset === void 0)
      offset = timezoneOffset;
    return new Date(+date + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  __name2(fromDateNumber, "fromDateNumber");
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture)
      return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  __name2(parseTime, "parseTime");
  function parseDate(date) {
    const parsed = parseTime(date);
    if (parsed) {
      date = Date.now() + parsed;
    } else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) {
      date = `${new Date().toLocaleDateString()}-${date}`;
    } else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) {
      date = `${new Date().getFullYear()}-${date}`;
    }
    return date ? new Date(date) : new Date();
  }
  Time2.parseDate = parseDate;
  __name2(parseDate, "parseDate");
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) {
      return Math.round(ms / Time2.day) + "d";
    } else if (abs >= Time2.hour - Time2.minute / 2) {
      return Math.round(ms / Time2.hour) + "h";
    } else if (abs >= Time2.minute - Time2.second / 2) {
      return Math.round(ms / Time2.minute) + "m";
    } else if (abs >= Time2.second) {
      return Math.round(ms / Time2.second) + "s";
    }
    return ms + "ms";
  }
  Time2.format = format;
  __name2(format, "format");
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  __name2(toDigits, "toDigits");
  function template(template2, time = new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time2.template = template;
  __name2(template, "template");
})(Time || (Time = {}));

// node_modules/schemastery/lib/index.mjs
var __defProp3 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name3 = (target, value) => __defProp3(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_src = __commonJS({
  "packages/schemastery/packages/core/src/index.ts"(exports, module) {
    var kSchema = Symbol.for("schemastery");
    globalThis.__schemastery_index__ ?? (globalThis.__schemastery_index__ = 0);
    var Schema2 = __name3(function(options) {
      const schema = __name3(function(data) {
        return Schema2.resolve(data, schema)[0];
      }, "schema");
      if (options.refs) {
        const refs2 = valueMap(options.refs, (options2) => new Schema2(options2));
        const getRef = __name3((uid) => refs2[uid], "getRef");
        for (const key in refs2) {
          const options2 = refs2[key];
          options2.sKey = getRef(options2.sKey);
          options2.inner = getRef(options2.inner);
          options2.list = options2.list && options2.list.map(getRef);
          options2.dict = options2.dict && valueMap(options2.dict, getRef);
        }
        return refs2[options.uid];
      }
      Object.assign(schema, options);
      Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
      Object.setPrototypeOf(schema, Schema2.prototype);
      schema.meta || (schema.meta = {});
      schema.toString = schema.toString.bind(schema);
      return schema;
    }, "Schema");
    Schema2.prototype = Object.create(Function.prototype);
    Schema2.prototype[kSchema] = true;
    var refs;
    Schema2.prototype.toJSON = __name3(function toJSON() {
      var _a;
      if (refs) {
        refs[_a = this.uid] ?? (refs[_a] = JSON.parse(JSON.stringify({ ...this })));
        return this.uid;
      }
      refs = { [this.uid]: { ...this } };
      refs[this.uid] = JSON.parse(JSON.stringify({ ...this }));
      const result = { uid: this.uid, refs };
      refs = void 0;
      return result;
    }, "toJSON");
    Schema2.prototype.set = __name3(function set(key, value) {
      this.dict[key] = value;
      return this;
    }, "set");
    Schema2.prototype.push = __name3(function push(value) {
      this.list.push(value);
      return this;
    }, "push");
    for (const key of ["required", "hidden"]) {
      Object.assign(Schema2.prototype, {
        [key](value = true) {
          const schema = Schema2(this);
          schema.meta = { ...schema.meta, [key]: value };
          return schema;
        }
      });
    }
    Schema2.prototype.pattern = __name3(function pattern(regexp) {
      const schema = Schema2(this);
      const pattern2 = pick(regexp, ["source", "flags"]);
      schema.meta = { ...schema.meta, pattern: pattern2 };
      return schema;
    }, "pattern");
    Schema2.prototype.simplify = __name3(function simplify(value) {
      if (deepEqual(value, this.meta.default))
        return null;
      if (isNullable(value))
        return value;
      if (this.type === "object" || this.type === "dict") {
        const result = {};
        for (const key in value) {
          const schema = this.type === "object" ? this.dict[key] : this.inner;
          const item = schema == null ? void 0 : schema.simplify(value[key]);
          if (!isNullable(item))
            result[key] = item;
        }
        return result;
      } else if (this.type === "array" || this.type === "tuple") {
        const result = [];
        for (const key of value) {
          const schema = this.type === "array" ? this.inner : this.list[key];
          const item = schema ? schema.simplify(value[key]) : value[key];
          result.push(item);
        }
        return result;
      } else if (this.type === "intersect") {
        const result = {};
        for (const item of this.list) {
          Object.assign(result, item.simplify(value));
        }
        return result;
      } else if (this.type === "union") {
        for (const schema of this.list) {
          try {
            Schema2.resolve(value, schema);
            return schema.simplify(value);
          } catch {
          }
        }
      }
      return value;
    }, "simplify");
    Schema2.prototype.toString = __name3(function toString(inline) {
      var _a;
      return ((_a = formatters[this.type]) == null ? void 0 : _a.call(formatters, this, inline)) ?? `Schema<${this.type}>`;
    }, "toString");
    Schema2.prototype.role = __name3(function role(role, extra) {
      const schema = Schema2(this);
      schema.meta = { ...schema.meta, role, extra };
      return schema;
    }, "role");
    for (const key of ["default", "link", "comment", "description", "max", "min", "step"]) {
      Object.assign(Schema2.prototype, {
        [key](value) {
          const schema = Schema2(this);
          schema.meta = { ...schema.meta, [key]: value };
          return schema;
        }
      });
    }
    var resolvers = {};
    Schema2.extend = __name3(function extend(type, resolve) {
      resolvers[type] = resolve;
    }, "extend");
    Schema2.resolve = __name3(function resolve(data, schema, strict) {
      if (!schema)
        return [data];
      if (isNullable(data)) {
        if (schema.meta.required)
          throw new TypeError(`missing required value`);
        let current = schema;
        let fallback = schema.meta.default;
        while ((current == null ? void 0 : current.type) === "intersect" && isNullable(fallback)) {
          current = current.list[0];
          fallback = current == null ? void 0 : current.meta.default;
        }
        if (isNullable(fallback))
          return [data];
        data = clone(fallback);
      }
      const callback = resolvers[schema.type];
      if (callback)
        return callback(data, schema, strict);
      throw new TypeError(`unsupported type "${schema.type}"`);
    }, "resolve");
    Schema2.from = __name3(function from(source) {
      if (isNullable(source)) {
        return Schema2.any();
      } else if (["string", "number", "boolean"].includes(typeof source)) {
        return Schema2.const(source).required();
      } else if (source[kSchema]) {
        return source;
      } else if (typeof source === "function") {
        switch (source) {
          case String:
            return Schema2.string().required();
          case Number:
            return Schema2.number().required();
          case Boolean:
            return Schema2.boolean().required();
          case Function:
            return Schema2.function().required();
          default:
            return Schema2.is(source).required();
        }
      } else {
        throw new TypeError(`cannot infer schema from ${source}`);
      }
    }, "from");
    Schema2.natural = __name3(function natural() {
      return Schema2.number().step(1).min(0);
    }, "natural");
    Schema2.percent = __name3(function percent() {
      return Schema2.number().step(0.01).min(0).max(1).role("slider");
    }, "percent");
    Schema2.date = __name3(function date() {
      return Schema2.union([
        Schema2.is(Date),
        Schema2.transform(Schema2.string().role("datetime"), (value) => {
          const date2 = new Date(value);
          if (isNaN(+date2))
            throw new TypeError(`invalid date "${value}"`);
          return date2;
        }, true)
      ]);
    }, "date");
    Schema2.extend("any", (data) => {
      return [data];
    });
    Schema2.extend("never", (data) => {
      throw new TypeError(`expected nullable but got ${data}`);
    });
    Schema2.extend("const", (data, { value }) => {
      if (data === value)
        return [value];
      throw new TypeError(`expected ${value} but got ${data}`);
    });
    function checkWithinRange(data, meta, description) {
      const { max = Infinity, min = -Infinity } = meta;
      if (data > max)
        throw new TypeError(`expected ${description} <= ${max} but got ${data}`);
      if (data < min)
        throw new TypeError(`expected ${description} >= ${min} but got ${data}`);
    }
    __name3(checkWithinRange, "checkWithinRange");
    Schema2.extend("string", (data, { meta }) => {
      if (typeof data !== "string")
        throw new TypeError(`expected string but got ${data}`);
      if (meta.pattern) {
        const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
        if (!regexp.test(data))
          throw new TypeError(`expect string to match regexp ${regexp}`);
      }
      checkWithinRange(data.length, meta, "string length");
      return [data];
    });
    Schema2.extend("number", (data, { meta }) => {
      if (typeof data !== "number")
        throw new TypeError(`expected number but got ${data}`);
      checkWithinRange(data, meta, "number");
      const { step } = meta;
      if (step) {
        const quotient = Math.abs(data - (meta.min ?? 0)) % step;
        if (quotient >= Number.EPSILON && quotient < step - Number.EPSILON) {
          throw new TypeError(`expected number multiple of ${step} but got ${data}`);
        }
      }
      return [data];
    });
    Schema2.extend("boolean", (data) => {
      if (typeof data === "boolean")
        return [data];
      throw new TypeError(`expected boolean but got ${data}`);
    });
    Schema2.extend("bitset", (data, { bits }) => {
      if (typeof data === "number")
        return [data];
      if (!Array.isArray(data))
        throw new TypeError(`expected array but got ${data}`);
      let result = 0;
      for (const value of data) {
        if (typeof value !== "string")
          throw new TypeError(`expected string but got ${value}`);
        if (!(value in bits))
          throw new TypeError(`unknown value ${value}`);
        result |= bits[value];
      }
      return [result, result];
    });
    Schema2.extend("function", (data) => {
      if (typeof data === "function")
        return [data];
      throw new TypeError(`expected function but got ${data}`);
    });
    Schema2.extend("is", (data, { callback }) => {
      if (data instanceof callback)
        return [data];
      throw new TypeError(`expected ${callback.name} but got ${data}`);
    });
    function property(data, key, schema) {
      const [value, adapted] = Schema2.resolve(data[key], schema);
      if (!isNullable(adapted))
        data[key] = adapted;
      return value;
    }
    __name3(property, "property");
    Schema2.extend("array", (data, { inner, meta }) => {
      if (!Array.isArray(data))
        throw new TypeError(`expected array but got ${data}`);
      checkWithinRange(data.length, meta, "array length");
      return [data.map((_, index) => property(data, index, inner))];
    });
    Schema2.extend("dict", (data, { inner, sKey }, strict) => {
      if (!isPlainObject(data))
        throw new TypeError(`expected object but got ${data}`);
      const result = {};
      for (const key in data) {
        let rKey;
        try {
          rKey = Schema2.resolve(key, sKey)[0];
        } catch (error) {
          if (strict)
            continue;
          throw error;
        }
        result[rKey] = property(data, key, inner);
        data[rKey] = data[key];
        if (key !== rKey)
          delete data[key];
      }
      return [result];
    });
    Schema2.extend("tuple", (data, { list }, strict) => {
      if (!Array.isArray(data))
        throw new TypeError(`expected array but got ${data}`);
      const result = list.map((inner, index) => property(data, index, inner));
      if (strict)
        return [result];
      result.push(...data.slice(list.length));
      return [result];
    });
    function merge(result, data) {
      for (const key in data) {
        if (key in result)
          continue;
        result[key] = data[key];
      }
    }
    __name3(merge, "merge");
    Schema2.extend("object", (data, { dict }, strict) => {
      if (!isPlainObject(data))
        throw new TypeError(`expected object but got ${data}`);
      const result = {};
      for (const key in dict) {
        const value = property(data, key, dict[key]);
        if (!isNullable(value) || key in data) {
          result[key] = value;
        }
      }
      if (!strict)
        merge(result, data);
      return [result];
    });
    Schema2.extend("union", (data, { list, toString }) => {
      const messages = [];
      for (const inner of list) {
        try {
          return Schema2.resolve(data, inner);
        } catch (error) {
        }
      }
      throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
    });
    Schema2.extend("intersect", (data, { list, toString }, strict) => {
      let result;
      for (const inner of list) {
        const value = Schema2.resolve(data, inner, true)[0];
        if (isNullable(value))
          continue;
        if (isNullable(result)) {
          result = value;
        } else if (typeof result !== typeof value) {
          throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
        } else if (typeof value === "object") {
          result = { ...result, ...value };
        } else if (result !== value) {
          throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
        }
      }
      if (!strict && isPlainObject(data))
        merge(result, data);
      return [result];
    });
    Schema2.extend("transform", (data, { inner, callback, preserve }) => {
      const [result, adapted = data] = Schema2.resolve(data, inner, true);
      if (isPlainObject(data)) {
        const temp = {};
        for (const key in result) {
          if (!(key in data))
            continue;
          temp[key] = data[key];
          delete data[key];
        }
        Object.assign(data, callback(temp));
        return [callback(result)];
      } else if (preserve) {
        return [callback(result)];
      } else {
        return [callback(result), callback(adapted)];
      }
    });
    var formatters = {};
    function defineMethod(name, keys, format) {
      formatters[name] = format;
      Object.assign(Schema2, {
        [name](...args) {
          const schema = new Schema2({ type: name });
          keys.forEach((key, index) => {
            switch (key) {
              case "sKey":
                schema.sKey = args[index] ?? Schema2.string();
                break;
              case "inner":
                schema.inner = Schema2.from(args[index]);
                break;
              case "list":
                schema.list = args[index].map(Schema2.from);
                break;
              case "dict":
                schema.dict = valueMap(args[index], Schema2.from);
                break;
              case "bits": {
                schema.bits = {};
                for (const key2 in args[index]) {
                  if (typeof args[index][key2] !== "number")
                    continue;
                  schema.bits[key2] = args[index][key2];
                }
                break;
              }
              default:
                schema[key] = args[index];
            }
          });
          if (name === "object" || name === "dict") {
            schema.meta.default = {};
          } else if (name === "array" || name === "tuple") {
            schema.meta.default = [];
          } else if (name === "bitset") {
            schema.meta.default = 0;
          }
          return schema;
        }
      });
    }
    __name3(defineMethod, "defineMethod");
    defineMethod("is", ["callback"], ({ callback }) => callback.name);
    defineMethod("any", [], () => "any");
    defineMethod("never", [], () => "never");
    defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
    defineMethod("string", [], () => "string");
    defineMethod("number", [], () => "number");
    defineMethod("boolean", [], () => "boolean");
    defineMethod("bitset", ["bits"], () => "bitset");
    defineMethod("function", [], () => "function");
    defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
    defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
    defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
    defineMethod("object", ["dict"], ({ dict }) => {
      if (Object.keys(dict).length === 0)
        return "{}";
      return `{ ${Object.entries(dict).map(([key, inner]) => {
        return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
      }).join(", ")} }`;
    });
    defineMethod("union", ["list"], ({ list }, inline) => {
      const result = list.map(({ toString: format }) => format()).join(" | ");
      return inline ? `(${result})` : result;
    });
    defineMethod("intersect", ["list"], ({ list }) => {
      return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
    });
    defineMethod("transform", ["inner", "callback", "preserve"], ({ inner }, isInner) => inner.toString(isInner));
    module.exports = Schema2;
  }
});
var lib_default = require_src();

// node_modules/schemastery-vue/src/utils.ts
var primitive = ["string", "number", "boolean", "bitset", "const"];
var dynamic = ["function", "transform", "is"];
var composite = ["array", "dict"];
function isObjectSchema(schema) {
  if (schema.type === "object") {
    return true;
  } else if (schema.type === "intersect") {
    return schema.list.every(isObjectSchema);
  } else if (schema.type === "union") {
    return getChoices(schema).every(isObjectSchema);
  } else {
    return false;
  }
}
function getChoices(schema) {
  const inner = [];
  const choices = schema.list.filter((item) => {
    if (item.meta.hidden)
      return;
    if (item.type === "transform")
      inner.push(item.inner);
    return !dynamic.includes(item.type);
  });
  return choices.length ? choices : inner;
}
function getFallback(schema, required = false) {
  if (!schema || schema.type === "union" && getChoices(schema).length === 1)
    return;
  return clone(schema.meta.default) ?? (required ? inferFallback(schema) : void 0);
}
function inferFallback(schema) {
  if (schema.type === "string")
    return "";
  if (schema.type === "number")
    return 0;
  if (schema.type === "boolean")
    return false;
  if (["dict", "object", "intersect"].includes(schema.type))
    return {};
}
function validate(schema) {
  if (!schema || schema.meta.hidden)
    return true;
  if (schema.type === "object") {
    return Object.values(schema.dict).every(validate);
  } else if (schema.type === "intersect") {
    return schema.list.every(isObjectSchema);
  } else if (schema.type === "union") {
    const choices = getChoices(schema);
    return choices.length === 1 || choices.every((item) => validate(item));
  } else if (composite.includes(schema.type)) {
    return validate(schema.inner);
  } else if (schema.type === "tuple") {
    return schema.list.every((item) => primitive.includes(item.type));
  } else if (schema.type === "any") {
    return ["filter"].includes(schema.meta.role);
  } else {
    return primitive.includes(schema.type);
  }
}
function hasTitle(schema, root2) {
  if (!schema)
    return true;
  if (schema.type === "object") {
    if (schema.meta.description)
      return true;
    const keys = Object.keys(schema.dict);
    if (!keys.length)
      return true;
    return hasTitle(schema.dict[keys[0]]);
  } else if (schema.type === "intersect") {
    return hasTitle(schema.list[0]);
  } else if (schema.type === "union") {
    const choices = getChoices(schema);
    return choices.length === 1 ? hasTitle(choices[0]) : false;
  } else if (root2 && composite.includes(schema.type) && validate(schema.inner)) {
    return true;
  } else {
    return false;
  }
}

// node_modules/schemastery-vue/src/index.ts
function src_default2(app) {
  app.component("k-schema", Schema);
}

// node_modules/@koishijs/client/client/components/index.ts
import ChatImage from "D:/company/cat/node_modules/@koishijs/client/client/components/chat/image.vue";

// node_modules/@koishijs/client/client/components/icons/index.ts
var icons_exports = {};
__export(icons_exports, {
  install: () => install,
  register: () => register
});
import Default from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/activity/default.vue";
import Ellipsis from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/activity/ellipsis.vue";
import Home from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/activity/home.vue";
import Moon from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/activity/moon.vue";
import Sun from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/activity/sun.vue";
import BoxOpen from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/box-open.vue";
import CheckFull from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/check-full.vue";
import ChevronDown from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/chevron-down.vue";
import ChevronLeft from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/chevron-left.vue";
import ChevronRight from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/chevron-right.vue";
import ChevronUp from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/chevron-up.vue";
import ClipboardList from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/clipboard-list.vue";
import Delete from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/delete.vue";
import Edit from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/edit.vue";
import ExclamationFull from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/exclamation-full.vue";
import Expand from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/expand.vue";
import FileArchive from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/file-archive.vue";
import Filter2 from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/filter.vue";
import GitHub from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/github.vue";
import GitLab from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/gitlab.vue";
import InfoFull from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/info-full.vue";
import Koishi from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/koishi.vue";
import Link from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/link.vue";
import PaperPlane from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/paper-plane.vue";
import QuestionEmpty from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/question-empty.vue";
import Redo from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/redo.vue";
import Search from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/search.vue";
import SearchMinus from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/search-minus.vue";
import SearchPlus from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/search-plus.vue";
import StarEmpty from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/star-empty.vue";
import StarFull from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/star-full.vue";
import Start from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/start.vue";
import Tag from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/tag.vue";
import TimesFull from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/times-full.vue";
import Tools from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/tools.vue";
import Undo from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/undo.vue";
import User from "D:/company/cat/node_modules/@koishijs/client/client/components/icons/svg/user.vue";
import "D:/company/cat/node_modules/@koishijs/client/client/components/icons/style.scss";
var registry = {};
register("activity:default", Default);
register("activity:ellipsis", Ellipsis);
register("activity:home", Home);
register("activity:moon", Moon);
register("activity:sun", Sun);
register("box-open", BoxOpen);
register("check-full", CheckFull);
register("chevron-down", ChevronDown);
register("chevron-left", ChevronLeft);
register("chevron-right", ChevronRight);
register("chevron-up", ChevronUp);
register("clipboard-list", ClipboardList);
register("delete", Delete);
register("edit", Edit);
register("exclamation-full", ExclamationFull);
register("expand", Expand);
register("external", IconExternal);
register("eye-slash", IconEyeSlash);
register("eye", IconEye);
register("file-archive", FileArchive);
register("filter", Filter2);
register("github", GitHub);
register("gitlab", GitLab);
register("info-full", InfoFull);
register("koishi", Koishi);
register("link", Link);
register("paper-plane", PaperPlane);
register("question-empty", QuestionEmpty);
register("redo", Redo);
register("search", Search);
register("search-minus", SearchMinus);
register("search-plus", SearchPlus);
register("star-empty", StarEmpty);
register("star-full", StarFull);
register("start", Start);
register("tag", Tag);
register("times-full", TimesFull);
register("tools", Tools);
register("undo", Undo);
register("user", User);
function register(name, component) {
  registry[name] = component;
}
function install(app) {
  app.component("k-icon", defineComponent({
    props: {
      name: String
    },
    render(props) {
      return props.name && h(registry[props.name]);
    }
  }));
}

// node_modules/@koishijs/client/client/components/layout/index.ts
import Layout from "D:/company/cat/node_modules/@koishijs/client/client/components/layout/k-layout.vue";
import Status from "D:/company/cat/node_modules/@koishijs/client/client/components/layout/k-status.vue";
import CardNumeric from "D:/company/cat/node_modules/@koishijs/client/client/components/layout/card-numeric.vue";
import Card from "D:/company/cat/node_modules/@koishijs/client/client/components/layout/card.vue";
import Content from "D:/company/cat/node_modules/@koishijs/client/client/components/layout/content.vue";
import Empty from "D:/company/cat/node_modules/@koishijs/client/client/components/layout/empty.vue";
import TabGroup from "D:/company/cat/node_modules/@koishijs/client/client/components/layout/tab-group.vue";
import TabItem from "D:/company/cat/node_modules/@koishijs/client/client/components/layout/tab-item.vue";

// node_modules/@koishijs/client/client/components/layout/utils.ts
var isLeftAsideOpen = ref(false);

// node_modules/@koishijs/client/client/components/layout/index.ts
function layout_default(app) {
  app.component("k-layout", Layout);
  app.component("k-status", Status);
  app.component("k-numeric", CardNumeric);
  app.component("k-card", Card);
  app.component("k-content", Content);
  app.component("k-empty", Empty);
  app.component("k-tab-group", TabGroup);
  app.component("k-tab-item", TabItem);
}

// node_modules/@koishijs/client/client/components/notice/index.ts
import Badge from "D:/company/cat/node_modules/@koishijs/client/client/components/notice/badge.vue";
import Comment2 from "D:/company/cat/node_modules/@koishijs/client/client/components/notice/comment.vue";
import Hint from "D:/company/cat/node_modules/@koishijs/client/client/components/notice/hint.vue";
function notice_default(app) {
  app.component("k-badge", Badge);
  app.component("k-comment", Comment2);
  app.component("k-hint", Hint);
}

// node_modules/@koishijs/client/client/components/slot.ts
var slot_default = defineComponent({
  props: {
    name: String,
    data: Object,
    tag: {
      default: "div"
    }
  },
  setup: ({ name, data, tag }, { slots }) => () => {
    var _a;
    return h(tag, [
      ...((_a = slots.default) == null ? void 0 : _a.call(slots)) || [],
      ...(views[name] || []).map((view) => h(view.component, { data }))
    ]);
  }
});

// node_modules/@koishijs/client/client/components/index.ts
import "D:/company/cat/node_modules/element-plus/dist/index.css";

// node_modules/@satorijs/components/src/chat/index.ts
import ChatInput from "D:/company/cat/node_modules/@satorijs/components/src/chat/input.vue";
import MessageContent from "D:/company/cat/node_modules/@satorijs/components/src/chat/content.vue";

// node_modules/@satorijs/components/src/popper/index.ts
import Dropdown from "D:/company/cat/node_modules/@satorijs/components/src/popper/dropdown.vue";
import Popper from "D:/company/cat/node_modules/@satorijs/components/src/popper/popper.vue";
import Tooltip from "D:/company/cat/node_modules/@satorijs/components/src/popper/tooltip.vue";

// node_modules/@satorijs/components/src/popper/shared.ts
var injections;
((injections2) => {
  injections2.placement = Symbol("INJECTION_PLACEMENT");
  injections2.teleport = Symbol("INJECTION_TELEPORT");
})(injections || (injections = {}));

// node_modules/@satorijs/components/src/virtual/item.ts
var useRefDirective = (ref2) => ({
  mounted(el) {
    ref2.value = el;
  },
  updated(el) {
    ref2.value = el;
  },
  beforeUnmount() {
    ref2.value = null;
  }
});
function findFirstLegitChild(node) {
  if (!node)
    return null;
  for (const child of node) {
    if (typeof child === "object") {
      switch (child.type) {
        case Comment:
          continue;
        case Text:
          break;
        case Fragment:
          return findFirstLegitChild(child.children);
        default:
          if (typeof child.type === "string")
            return child;
          return child;
      }
    }
    return h("span", child);
  }
}
var VirtualItem = defineComponent({
  props: {
    class: {}
  },
  emits: ["resize"],
  setup(props, { attrs, slots, emit }) {
    let resizeObserver;
    const root2 = ref();
    watch(root2, (value) => {
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
      if (!value)
        return;
      resizeObserver = new ResizeObserver(dispatchSizeChange);
      resizeObserver.observe(value);
    });
    function dispatchSizeChange() {
      if (!root2.value)
        return;
      const marginTop = +getComputedStyle(root2.value).marginTop.slice(0, -2);
      emit("resize", root2.value.offsetHeight + marginTop);
    }
    const directive = useRefDirective(root2);
    return () => {
      var _a;
      const head = findFirstLegitChild((_a = slots.default) == null ? void 0 : _a.call(slots, attrs));
      return withDirectives(head, [[directive]]);
    };
  }
});
var item_default = VirtualItem;

// node_modules/@satorijs/components/src/virtual/index.ts
import VirtualList from "D:/company/cat/node_modules/@satorijs/components/src/virtual/list.vue";

// node_modules/@koishijs/client/client/components/index.ts
var loading = ElLoading.service;
var message = ElMessage;
var messageBox = ElMessageBox;
function components_default(app) {
  app.use(installer);
  app.component("k-markdown", src_default);
  app.use(common_default);
  app.use(src_default2);
  app.use(icons_exports);
  app.use(layout_default);
  app.use(notice_default);
  app.component("k-slot", slot_default);
}

// node_modules/@koishijs/client/client/index.ts
import Overlay from "D:/company/cat/node_modules/@koishijs/client/client/components/chat/overlay.vue";

// node_modules/@koishijs/client/client/loader.ts
function defineExtension(callback) {
  return callback;
}
var loaders = {
  async [`.css`](path) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    await new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
    return () => {
      document.head.removeChild(link);
    };
  },
  async [``](path) {
    const exports = await import(
      /* @vite-ignore */
      path
    );
    const fork = root.plugin(exports.default);
    return fork.dispose;
  }
};
var progress = ref(0);
function notify() {
  const results = Object.values(extensions);
  progress.value = results.filter(({ done }) => done).length / results.length;
}
function queue(key, callback, isExtension = false) {
  const task = callback(key);
  const result = { done: false, task, isExtension };
  task.finally(() => {
    result.done = true;
    notify();
  });
  if (!extensions[key]) {
    extensions[key] = result;
    notify();
  }
  return task;
}
function load(path) {
  for (const ext in loaders) {
    if (!path.endsWith(ext))
      continue;
    return queue(path, loaders[ext], true);
  }
}
var extensions = {};
var initTask = new Promise((resolve) => {
  watch(() => store.entry, async (newValue, oldValue) => {
    newValue || (newValue = []);
    for (const path in extensions) {
      if (newValue.includes(path))
        continue;
      if (!extensions[path].isExtension)
        continue;
      extensions[path].task.then((dispose) => dispose());
      delete extensions[path];
    }
    await Promise.all(newValue.map(load));
    if (!oldValue)
      resolve();
  }, { deep: true });
});

// node_modules/cordis/lib/index.mjs
var __defProp4 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name4 = (target, value) => __defProp4(target, "name", { value, configurable: true });
var __publicField2 = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function isBailed(value) {
  return value !== null && value !== false && value !== void 0;
}
__name4(isBailed, "isBailed");
var Lifecycle = class {
  constructor(root2) {
    __publicField(this, "isActive", false);
    __publicField(this, "_tasks", /* @__PURE__ */ new Set());
    __publicField(this, "_hooks", {});
    this.root = root2;
    defineProperty(this, Context2.current, root2);
    defineProperty(this.on("internal/hook", function(name, listener, prepend) {
      const method = prepend ? "unshift" : "push";
      const { scope } = this[Context2.current];
      const { runtime, disposables } = scope;
      if (name === "ready" && this.isActive) {
        scope.ensure(async () => listener());
      } else if (name === "dispose") {
        disposables[method](listener);
        defineProperty(listener, "name", "event <dispose>");
        return () => remove(disposables, listener);
      } else if (name === "fork") {
        runtime.forkables[method](listener);
        return scope.collect("event <fork>", () => remove(runtime.forkables, listener));
      }
    }), Context2.static, root2.scope);
  }
  /** @deprecated */
  queue(value) {
    this[Context2.current].scope.ensure(async () => value);
  }
  async flush() {
    while (this._tasks.size) {
      await Promise.all(Array.from(this._tasks));
    }
  }
  *getHooks(name, thisArg) {
    const hooks = this._hooks[name] || [];
    for (const [context, callback] of hooks.slice()) {
      const filter = thisArg == null ? void 0 : thisArg[Context2.filter];
      if (filter && !filter.call(thisArg, context))
        continue;
      yield callback;
    }
  }
  async parallel(...args) {
    const thisArg = typeof args[0] === "object" ? args.shift() : null;
    const name = args.shift();
    await Promise.all([...this.getHooks(name, thisArg)].map(async (callback) => {
      await callback.apply(thisArg, args);
    }));
  }
  emit(...args) {
    const thisArg = typeof args[0] === "object" ? args.shift() : null;
    const name = args.shift();
    for (const callback of this.getHooks(name, thisArg)) {
      callback.apply(thisArg, args);
    }
  }
  async serial(...args) {
    const thisArg = typeof args[0] === "object" ? args.shift() : null;
    const name = args.shift();
    for (const callback of this.getHooks(name, thisArg)) {
      const result = await callback.apply(thisArg, args);
      if (isBailed(result))
        return result;
    }
  }
  bail(...args) {
    const thisArg = typeof args[0] === "object" ? args.shift() : null;
    const name = args.shift();
    for (const callback of this.getHooks(name, thisArg)) {
      const result = callback.apply(thisArg, args);
      if (isBailed(result))
        return result;
    }
  }
  register(label, hooks, listener, prepend) {
    const maxListeners = this.root.config.maxListeners;
    if (hooks.length >= maxListeners) {
      this.root.emit("internal/warning", `max listener count (${maxListeners}) for ${label} exceeded, which may be caused by a memory leak`);
    }
    const caller = this[Context2.current];
    const method = prepend ? "unshift" : "push";
    hooks[method]([caller, listener]);
    return caller.state.collect(label, () => this.unregister(hooks, listener));
  }
  unregister(hooks, listener) {
    const index = hooks.findIndex(([context, callback]) => callback === listener);
    if (index >= 0) {
      hooks.splice(index, 1);
      return true;
    }
  }
  on(name, listener, prepend = false) {
    var _a;
    const result = this.bail(this, "internal/hook", name, listener, prepend);
    if (result)
      return result;
    const hooks = (_a = this._hooks)[name] || (_a[name] = []);
    const label = typeof name === "string" ? `event <${name}>` : "event (Symbol)";
    return this.register(label, hooks, listener, prepend);
  }
  once(name, listener, prepend = false) {
    const dispose = this.on(name, function(...args) {
      dispose();
      return listener.apply(this, args);
    }, prepend);
    return dispose;
  }
  off(name, listener) {
    return this.unregister(this._hooks[name] || [], listener);
  }
  async start() {
    this.isActive = true;
    const hooks = this._hooks.ready || [];
    while (hooks.length) {
      const [context, callback] = hooks.shift();
      context.scope.ensure(async () => callback());
    }
    await this.flush();
  }
  async stop() {
    this.isActive = false;
    this.root.scope.reset();
  }
};
__name4(Lifecycle, "Lifecycle");
__publicField2(Lifecycle, "methods", ["on", "once", "off", "before", "after", "parallel", "emit", "serial", "bail", "start", "stop"]);
function isConstructor(func) {
  if (!func.prototype)
    return false;
  if (func.prototype.constructor !== func)
    return false;
  return true;
}
__name4(isConstructor, "isConstructor");
function getConstructor(instance) {
  return Object.getPrototypeOf(instance).constructor;
}
__name4(getConstructor, "getConstructor");
function resolveConfig(plugin, config2) {
  if (config2 === false)
    return;
  if (config2 === true)
    config2 = void 0;
  config2 ?? (config2 = {});
  const schema = plugin["Config"] || plugin["schema"];
  if (schema && plugin["schema"] !== false)
    config2 = schema(config2);
  return config2;
}
__name4(resolveConfig, "resolveConfig");
var EffectScope = class {
  constructor(parent, config2) {
    __publicField(this, "uid");
    __publicField(this, "ctx");
    __publicField(this, "disposables", []);
    __publicField(this, "error");
    __publicField(this, "status", "pending");
    __publicField(this, "proxy");
    __publicField(this, "context");
    __publicField(this, "acceptors", []);
    __publicField(this, "tasks", /* @__PURE__ */ new Set());
    __publicField(this, "hasError", false);
    this.parent = parent;
    this.config = config2;
    this.uid = parent.registry ? parent.registry.counter : 0;
    this.ctx = this.context = parent.extend({ scope: this });
    this.proxy = new Proxy({}, {
      get: (target, key) => Reflect.get(this.config, key)
    });
  }
  get _config() {
    return this.runtime.isReactive ? this.proxy : this.config;
  }
  collect(label, callback) {
    const dispose = defineProperty(() => {
      remove(this.disposables, dispose);
      return callback();
    }, "name", label);
    this.disposables.push(dispose);
    return dispose;
  }
  restart() {
    this.reset();
    this.start();
  }
  _getStatus() {
    if (this.uid === null)
      return "disposed";
    if (this.hasError)
      return "failed";
    if (this.tasks.size)
      return "loading";
    if (this.ready)
      return "active";
    return "pending";
  }
  _updateStatus(callback) {
    const oldValue = this.status;
    callback == null ? void 0 : callback();
    this.status = this._getStatus();
    if (oldValue !== this.status) {
      this.context.emit("internal/status", this, oldValue);
    }
  }
  ensure(callback) {
    const task = callback().catch((reason) => {
      this.context.emit("internal/warning", reason);
      this.cancel(reason);
    }).finally(() => {
      this._updateStatus(() => this.tasks.delete(task));
      this.context.events._tasks.delete(task);
    });
    this._updateStatus(() => this.tasks.add(task));
    this.context.events._tasks.add(task);
  }
  cancel(reason) {
    this.error = reason;
    this._updateStatus(() => this.hasError = true);
    this.reset();
  }
  setup() {
    if (!this.runtime.using.length)
      return;
    defineProperty(this.context.on("internal/before-service", (name) => {
      if (!this.runtime.using.includes(name))
        return;
      this._updateStatus();
      this.reset();
    }), Context2.static, this);
    defineProperty(this.context.on("internal/service", (name) => {
      if (!this.runtime.using.includes(name))
        return;
      this.start();
    }), Context2.static, this);
  }
  get ready() {
    return this.runtime.using.every((name) => this.ctx[name]);
  }
  reset() {
    this.disposables = this.disposables.splice(0, Infinity).filter((dispose) => {
      if (this.uid !== null && dispose[Context2.static] === this)
        return true;
      dispose();
    });
  }
  accept(...args) {
    var _a;
    const keys = Array.isArray(args[0]) ? args.shift() : null;
    const acceptor = { keys, callback: args[0], ...args[1] };
    this.acceptors.push(acceptor);
    if (acceptor.immediate)
      (_a = acceptor.callback) == null ? void 0 : _a.call(acceptor, this.config);
    return this.collect(`accept <${(keys == null ? void 0 : keys.join(", ")) || "*"}>`, () => remove(this.acceptors, acceptor));
  }
  decline(keys) {
    return this.accept(keys, () => true);
  }
  checkUpdate(resolved, forced) {
    if (forced)
      return [true, true];
    if (forced === false)
      return [false, false];
    const modified = /* @__PURE__ */ Object.create(null);
    const checkPropertyUpdate = __name4((key) => {
      const result = modified[key] ?? (modified[key] = !deepEqual(this.config[key], resolved[key]));
      hasUpdate || (hasUpdate = result);
      return result;
    }, "checkPropertyUpdate");
    const ignored = /* @__PURE__ */ new Set();
    let hasUpdate = false, shouldRestart = false;
    let fallback = this.runtime.isReactive || null;
    for (const { keys, callback, passive } of this.acceptors) {
      if (!keys) {
        fallback || (fallback = !passive);
      } else if (passive) {
        keys == null ? void 0 : keys.forEach((key) => ignored.add(key));
      } else {
        let hasUpdate2 = false;
        for (const key of keys) {
          hasUpdate2 || (hasUpdate2 = checkPropertyUpdate(key));
        }
        if (!hasUpdate2)
          continue;
      }
      const result = callback == null ? void 0 : callback(resolved);
      if (result)
        shouldRestart = true;
    }
    for (const key in { ...this.config, ...resolved }) {
      if (fallback === false)
        continue;
      if (!(key in modified) && !ignored.has(key)) {
        const hasUpdate2 = checkPropertyUpdate(key);
        if (fallback === null)
          shouldRestart || (shouldRestart = hasUpdate2);
      }
    }
    return [hasUpdate, shouldRestart];
  }
};
__name4(EffectScope, "EffectScope");
var ForkScope = class extends EffectScope {
  constructor(parent, config2, runtime) {
    super(parent, config2);
    __publicField(this, "dispose");
    this.runtime = runtime;
    this.dispose = defineProperty(parent.scope.collect(`fork <${parent.runtime.name}>`, () => {
      this.uid = null;
      this.reset();
      const result = remove(runtime.disposables, this.dispose);
      if (remove(runtime.children, this) && !runtime.children.length) {
        parent.registry.delete(runtime.plugin);
      }
      this.context.emit("internal/fork", this);
      return result;
    }), Context2.static, runtime);
    runtime.children.push(this);
    runtime.disposables.push(this.dispose);
    this.context.emit("internal/fork", this);
    if (runtime.isReusable) {
      this.setup();
    }
    this.start();
  }
  start() {
    if (!this.ready)
      return;
    this._updateStatus(() => this.hasError = false);
    for (const fork of this.runtime.forkables) {
      this.ensure(async () => fork(this.context, this._config));
    }
  }
  update(config2, forced) {
    const oldConfig = this.config;
    const state = this.runtime.isForkable ? this : this.runtime;
    if (state.config !== oldConfig)
      return;
    const resolved = resolveConfig(this.runtime.plugin, config2);
    const [hasUpdate, shouldRestart] = state.checkUpdate(resolved, forced);
    this.context.emit("internal/before-update", this, config2);
    this.config = resolved;
    state.config = resolved;
    if (hasUpdate) {
      this.context.emit("internal/update", this, oldConfig);
    }
    if (shouldRestart)
      state.restart();
  }
};
__name4(ForkScope, "ForkScope");
var MainScope = class extends EffectScope {
  constructor(registry2, plugin, config2) {
    super(registry2[Context2.current], config2);
    __publicField(this, "runtime", this);
    __publicField(this, "schema");
    __publicField(this, "using", []);
    __publicField(this, "forkables", []);
    __publicField(this, "children", []);
    __publicField(this, "isReusable", false);
    __publicField(this, "isReactive", false);
    __publicField(this, "apply", (context, config2) => {
      const plugin = this.plugin;
      if (typeof plugin !== "function") {
        this.ensure(async () => plugin.apply(context, config2));
      } else if (isConstructor(plugin)) {
        const instance = new plugin(context, config2);
        const name = instance[Context2.immediate];
        if (name) {
          context[name] = instance;
        }
        if (instance["fork"]) {
          this.forkables.push(instance["fork"].bind(instance));
        }
      } else {
        this.ensure(async () => plugin(context, config2));
      }
    });
    this.plugin = plugin;
    registry2.set(plugin, this);
    if (plugin)
      this.setup();
  }
  get isForkable() {
    return this.forkables.length > 0;
  }
  get name() {
    if (!this.plugin)
      return "root";
    const { name } = this.plugin;
    return !name || name === "apply" ? "anonymous" : name;
  }
  fork(parent, config2) {
    return new ForkScope(parent, config2, this);
  }
  dispose() {
    this.uid = null;
    this.reset();
    this.context.emit("internal/runtime", this);
    return true;
  }
  setup() {
    this.schema = this.plugin["Config"] || this.plugin["schema"];
    this.using = this.plugin["using"] || [];
    this.isReusable = this.plugin["reusable"];
    this.isReactive = this.plugin["reactive"];
    this.context.emit("internal/runtime", this);
    if (this.isReusable) {
      this.forkables.push(this.apply);
    } else {
      super.setup();
    }
    this.restart();
  }
  reset() {
    super.reset();
    for (const fork of this.children) {
      fork.reset();
    }
  }
  start() {
    if (!this.ready)
      return;
    this._updateStatus(() => this.hasError = false);
    if (!this.isReusable && this.plugin) {
      this.apply(this.context, this._config);
    }
    for (const fork of this.children) {
      fork.start();
    }
  }
  update(config2, forced) {
    if (this.isForkable) {
      this.context.emit("internal/warning", `attempting to update forkable plugin "${this.plugin.name}", which may lead to unexpected behavior`);
    }
    const oldConfig = this.config;
    const resolved = resolveConfig(this.runtime.plugin || getConstructor(this.context), config2);
    const [hasUpdate, shouldRestart] = this.checkUpdate(resolved, forced);
    const state = this.children.find((fork) => fork.config === oldConfig);
    this.config = resolved;
    if (state) {
      this.context.emit("internal/before-update", state, config2);
      state.config = resolved;
      if (hasUpdate) {
        this.context.emit("internal/update", state, oldConfig);
      }
    }
    if (shouldRestart)
      this.restart();
  }
};
__name4(MainScope, "MainScope");
function isApplicable(object) {
  return object && typeof object === "object" && typeof object.apply === "function";
}
__name4(isApplicable, "isApplicable");
var Registry = class extends Map {
  constructor(root2, config2) {
    super();
    __publicField(this, "_counter", 0);
    this.root = root2;
    defineProperty(this, Context2.current, root2);
    root2.scope = new MainScope(this, null, config2);
    root2.scope.runtime.isReactive = true;
  }
  get counter() {
    return ++this._counter;
  }
  resolve(plugin) {
    return plugin && (typeof plugin === "function" ? plugin : plugin.apply);
  }
  get(plugin) {
    return super.get(this.resolve(plugin));
  }
  has(plugin) {
    return super.has(this.resolve(plugin));
  }
  set(plugin, state) {
    return super.set(this.resolve(plugin), state);
  }
  delete(plugin) {
    plugin = this.resolve(plugin);
    const runtime = this.get(plugin);
    if (!runtime)
      return false;
    super.delete(plugin);
    return runtime.dispose();
  }
  using(using, callback) {
    return this.plugin({ using, apply: callback, name: callback.name });
  }
  plugin(plugin, config2) {
    if (typeof plugin !== "function" && !isApplicable(plugin)) {
      throw new Error('invalid plugin, expect function or object with an "apply" method');
    }
    config2 = resolveConfig(plugin, config2);
    if (!config2)
      return;
    const context = this[Context2.current];
    let runtime = this.get(plugin);
    if (runtime) {
      if (!runtime.isForkable) {
        this.root.emit("internal/warning", `duplicate plugin detected: ${plugin.name}`);
      }
      return runtime.fork(context, config2);
    }
    runtime = new MainScope(this, plugin, config2);
    return runtime.fork(context, config2);
  }
  dispose(plugin) {
    return this.delete(plugin);
  }
};
__name4(Registry, "Registry");
__publicField2(Registry, "methods", ["using", "plugin", "dispose"]);
var _Context = class {
  constructor(config2) {
    const options = resolveConfig(getConstructor(this), config2);
    const attach = __name4((internal) => {
      if (!internal)
        return;
      attach(Object.getPrototypeOf(internal));
      for (const key of Object.getOwnPropertySymbols(internal)) {
        this[key] = new internal[key](this, options);
      }
    }, "attach");
    this.root = this;
    this.mapping = /* @__PURE__ */ Object.create(null);
    attach(this[_Context.internal]);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `Context <${this.runtime.name}>`;
  }
  get events() {
    return this.lifecycle;
  }
  /** @deprecated */
  get state() {
    return this.scope;
  }
  extend(meta = {}) {
    return Object.assign(Object.create(this), meta);
  }
  isolate(names) {
    const mapping = Object.create(this.mapping);
    for (const name of names) {
      mapping[name] = Symbol(name);
    }
    return this.extend({ mapping });
  }
};
var Context2 = _Context;
__name4(Context2, "Context");
__publicField2(Context2, "config", Symbol("config"));
__publicField2(Context2, "events", Symbol("events"));
__publicField2(Context2, "static", Symbol("static"));
__publicField2(Context2, "filter", Symbol("filter"));
__publicField2(Context2, "source", Symbol("source"));
__publicField2(Context2, "current", Symbol("current"));
__publicField2(Context2, "internal", Symbol("internal"));
__publicField2(Context2, "immediate", Symbol("immediate"));
((Context22) => {
  function mixin(name, options) {
    for (const key of options.methods || []) {
      const method = defineProperty(function(...args) {
        return this[name][key](...args);
      }, "name", key);
      defineProperty(this.prototype, key, method);
    }
    for (const key of options.properties || []) {
      Object.defineProperty(this.prototype, key, {
        configurable: true,
        get() {
          return this[name][key];
        },
        set(value) {
          this[name][key] = value;
        }
      });
    }
  }
  Context22.mixin = mixin;
  __name4(mixin, "mixin");
  function service(name, options = {}) {
    if (Object.prototype.hasOwnProperty.call(this.prototype, name))
      return;
    const privateKey = typeof name === "symbol" ? name : Symbol(name);
    Object.defineProperty(this.prototype, name, {
      configurable: true,
      get() {
        const key = this.mapping[name] || privateKey;
        const value = this.root[key];
        if (!value)
          return;
        defineProperty(value, Context22.current, this);
        return value;
      },
      set(value) {
        const key = this.mapping[name] || privateKey;
        const oldValue = this.root[key];
        if (oldValue === value)
          return;
        const self = /* @__PURE__ */ Object.create(null);
        self[Context22.filter] = (ctx) => {
          return this.mapping[name] === ctx.mapping[name];
        };
        if (value && oldValue && typeof name === "string") {
          throw new Error(`service ${name} has been registered`);
        }
        if (typeof name === "string") {
          this.emit(self, "internal/before-service", name, value);
        }
        this.root[key] = value;
        if (value && typeof value === "object") {
          defineProperty(value, Context22.source, this);
        }
        if (typeof name === "string") {
          this.emit(self, "internal/service", name, oldValue);
        }
      }
    });
    if (isConstructor(options)) {
      const internal = ensureInternal(this.prototype);
      internal[privateKey] = options;
    }
    this.mixin(name, options);
  }
  Context22.service = service;
  __name4(service, "service");
  function ensureInternal(prototype) {
    if (Object.prototype.hasOwnProperty.call(prototype, Context22.internal)) {
      return prototype[Context22.internal];
    }
    const parent = ensureInternal(Object.getPrototypeOf(prototype));
    return prototype[Context22.internal] = Object.create(parent);
  }
  __name4(ensureInternal, "ensureInternal");
})(Context2 || (Context2 = {}));
Context2.prototype[Context2.internal] = /* @__PURE__ */ Object.create(null);
Context2.service("registry", Registry);
Context2.service("lifecycle", Lifecycle);
Context2.mixin("state", {
  properties: ["config", "runtime"],
  methods: ["collect", "accept", "decline"]
});
var Service = class {
  constructor(ctx, name, immediate) {
    this.ctx = ctx;
    getConstructor(ctx.root).service(name);
    defineProperty(this, Context2.current, ctx);
    if (immediate) {
      this[Context2.immediate] = name;
    }
    ctx.on("ready", async () => {
      await Promise.resolve();
      await this.start();
      ctx[name] = this;
    });
    ctx.on("dispose", async () => {
      ctx[name] = null;
      await this.stop();
    });
  }
  start() {
  }
  stop() {
  }
  get caller() {
    return this[Context2.current];
  }
};
__name4(Service, "Service");

// node_modules/@koishijs/client/client/activity.ts
var activities = reactive({});
var Activity = class {
  constructor(options) {
    this.options = options;
    this._disposables = [];
    Object.assign(this, omit(options, ["icon", "name", "desc", "position"]));
    if ("path" in options) {
      const { path, id = path, component } = options;
      this._disposables.push(router.addRoute({ path, name: id, component, meta: { activity: this } }));
      this.id ?? (this.id = path);
      this.handleUpdate();
    }
    this.order ?? (this.order = 0);
    this.authority ?? (this.authority = 0);
    this.fields ?? (this.fields = []);
    activities[this.id] = this;
  }
  handleUpdate() {
    const { redirect } = router.currentRoute.value.query;
    if (typeof redirect === "string") {
      const location2 = router.resolve(redirect);
      if (location2.matched.length) {
        router.replace(location2);
      }
    }
  }
  get icon() {
    return resolveUnref(this.options.icon ?? "activity:default");
  }
  get name() {
    return resolveUnref(this.options.name ?? this.id);
  }
  get desc() {
    return resolveUnref(this.options.desc);
  }
  get position() {
    if (root.bail("activity", this))
      return;
    if (!this.fields.every((key) => store[key]))
      return;
    if (this.when && !this.when())
      return;
    return this.options.position ?? "top";
  }
  dispose() {
    var _a;
    this._disposables.forEach((dispose) => dispose());
    const current = router.currentRoute.value;
    if (((_a = current == null ? void 0 : current.meta) == null ? void 0 : _a.activity) === this) {
      router.push({
        path: "/",
        query: { redirect: current.fullPath }
      });
    }
    if (activities[this.id]) {
      delete activities[this.id];
      return true;
    }
  }
};

// node_modules/@koishijs/client/client/context.ts
var views = reactive({});
var Context3 = class extends Context2 {
  /** @deprecated */
  addView(options) {
    return this.slot(options);
  }
  /** @deprecated */
  addPage(options) {
    return this.page(options);
  }
  slot(options) {
    var _a;
    options.order ?? (options.order = 0);
    markRaw(options.component);
    const list = views[_a = options.type] || (views[_a] = []);
    const index = list.findIndex((a) => a.order < options.order);
    if (index >= 0) {
      list.splice(index, 0, options);
    } else {
      list.push(options);
    }
    return this.scope.collect("view", () => remove(list, options));
  }
  page(options) {
    const activity = new Activity(options);
    return this.scope.collect("page", () => {
      return activity.dispose();
    });
  }
};

// node_modules/@koishijs/client/client/index.ts
import "D:/company/cat/node_modules/@koishijs/client/client/styles/index.scss";
var client_default = components_default;
var router = createRouter({
  history: createWebHistory(config.uiPath),
  linkActiveClass: "active",
  routes: []
});
var root = new Context3();
root.slot({
  type: "global",
  component: Overlay
});
root.on("activity", (data) => !data);
router.beforeEach(async (to, from) => {
  if (to.matched.length)
    return;
  if (from === START_LOCATION_NORMALIZED) {
    await initTask;
    to = router.resolve(to);
    if (to.matched.length)
      return to;
  }
  return {
    path: "/",
    query: { redirect: to.fullPath }
  };
});
var Card2;
((Card3) => {
  function create(render, fields = []) {
    return defineComponent({
      render: () => fields.every((key) => store[key]) ? render() : null
    });
  }
  Card3.create = create;
  function numeric({ type, icon, fields, title, content }) {
    if (!type) {
      return defineComponent(() => () => {
        if (!fields.every((key) => store[key]))
          return;
        return h(resolveComponent("k-numeric"), { icon, title }, () => content(store));
      });
    }
    return defineComponent(() => () => {
      if (!fields.every((key) => store[key]))
        return;
      let value = content(store);
      if (isNullable(value))
        return;
      if (type === "size") {
        if (value >= (1 << 20) * 1e3) {
          value = (value / (1 << 30)).toFixed(1) + " GB";
        } else if (value >= (1 << 10) * 1e3) {
          value = (value / (1 << 20)).toFixed(1) + " MB";
        } else {
          value = (value / (1 << 10)).toFixed(1) + " KB";
        }
      }
      return h(resolveComponent("k-numeric"), { icon, title }, () => [value]);
    });
  }
  Card3.numeric = numeric;
})(Card2 || (Card2 = {}));
export {
  Activity,
  Card2 as Card,
  ChatImage,
  ChatInput,
  Context3 as Context,
  Dropdown,
  IconClose,
  IconEllipsis,
  IconExternal,
  IconEye,
  IconEyeSlash,
  MessageContent,
  Popper,
  lib_default as Schema,
  Time,
  Tooltip,
  item_default as VirtualItem,
  VirtualList,
  activities,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  camelCase,
  camelize,
  capitalize,
  clone,
  config,
  connect,
  contain,
  createStorage,
  deduplicate,
  deepEqual,
  client_default as default,
  defineExtension,
  defineProperty,
  difference,
  getChoices,
  getFallback,
  config as global,
  hasTitle,
  hyphenate,
  icons_exports as icons,
  inferFallback,
  initTask,
  injections,
  intersection,
  is,
  isLeftAsideOpen,
  isNullable,
  isObjectSchema,
  isPlainObject,
  loading,
  makeArray,
  message,
  messageBox,
  noop,
  omit,
  paramCase,
  pick,
  progress,
  provideStorage,
  queue,
  receive,
  remove,
  root,
  router,
  sanitize2 as sanitize,
  send,
  snakeCase,
  socket,
  store,
  trimSlash,
  uncapitalize,
  union,
  useStorage,
  validate,
  valueMap,
  views
};
//# sourceMappingURL=@koishijs_client.js.map
