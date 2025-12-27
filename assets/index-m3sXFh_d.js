var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _e, _a, _r, _s, _n, _o, _t;
var s;
(function(r) {
  r.LOAD = "LOAD", r.EXEC = "EXEC", r.FFPROBE = "FFPROBE", r.WRITE_FILE = "WRITE_FILE", r.READ_FILE = "READ_FILE", r.DELETE_FILE = "DELETE_FILE", r.RENAME = "RENAME", r.CREATE_DIR = "CREATE_DIR", r.LIST_DIR = "LIST_DIR", r.DELETE_DIR = "DELETE_DIR", r.ERROR = "ERROR", r.DOWNLOAD = "DOWNLOAD", r.PROGRESS = "PROGRESS", r.LOG = "LOG", r.MOUNT = "MOUNT", r.UNMOUNT = "UNMOUNT";
})(s || (s = {}));
const O = /* @__PURE__ */ (() => {
  let r = 0;
  return () => r++;
})(), D = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first"), u = new Error("called FFmpeg.terminate()");
class N {
  constructor() {
    __privateAdd(this, _e, null);
    __privateAdd(this, _a, {});
    __privateAdd(this, _r, {});
    __privateAdd(this, _s, []);
    __privateAdd(this, _n, []);
    __publicField(this, "loaded", false);
    __privateAdd(this, _o, () => {
      __privateGet(this, _e) && (__privateGet(this, _e).onmessage = ({ data: { id: t, type: e, data: a } }) => {
        switch (e) {
          case s.LOAD:
            this.loaded = true, __privateGet(this, _a)[t](a);
            break;
          case s.MOUNT:
          case s.UNMOUNT:
          case s.EXEC:
          case s.FFPROBE:
          case s.WRITE_FILE:
          case s.READ_FILE:
          case s.DELETE_FILE:
          case s.RENAME:
          case s.CREATE_DIR:
          case s.LIST_DIR:
          case s.DELETE_DIR:
            __privateGet(this, _a)[t](a);
            break;
          case s.LOG:
            __privateGet(this, _s).forEach((n) => n(a));
            break;
          case s.PROGRESS:
            __privateGet(this, _n).forEach((n) => n(a));
            break;
          case s.ERROR:
            __privateGet(this, _r)[t](a);
            break;
        }
        delete __privateGet(this, _a)[t], delete __privateGet(this, _r)[t];
      });
    });
    __privateAdd(this, _t, ({ type: t, data: e }, a = [], n) => __privateGet(this, _e) ? new Promise((i, d) => {
      const o = O();
      __privateGet(this, _e) && __privateGet(this, _e).postMessage({ id: o, type: t, data: e }, a), __privateGet(this, _a)[o] = i, __privateGet(this, _r)[o] = d, n == null ? void 0 : n.addEventListener("abort", () => {
        d(new DOMException(`Message # ${o} was aborted`, "AbortError"));
      }, { once: true });
    }) : Promise.reject(D));
    __publicField(this, "load", ({ classWorkerURL: t, ...e } = {}, { signal: a } = {}) => (__privateGet(this, _e) || (__privateSet(this, _e, t ? new Worker(new URL(t, import.meta.url), { type: "module" }) : new Worker(new URL("/assets/worker-BAOIWoxA.js", import.meta.url), { type: "module" })), __privateGet(this, _o).call(this)), __privateGet(this, _t).call(this, { type: s.LOAD, data: e }, void 0, a)));
    __publicField(this, "exec", (t, e = -1, { signal: a } = {}) => __privateGet(this, _t).call(this, { type: s.EXEC, data: { args: t, timeout: e } }, void 0, a));
    __publicField(this, "ffprobe", (t, e = -1, { signal: a } = {}) => __privateGet(this, _t).call(this, { type: s.FFPROBE, data: { args: t, timeout: e } }, void 0, a));
    __publicField(this, "terminate", () => {
      const t = Object.keys(__privateGet(this, _r));
      for (const e of t) __privateGet(this, _r)[e](u), delete __privateGet(this, _r)[e], delete __privateGet(this, _a)[e];
      __privateGet(this, _e) && (__privateGet(this, _e).terminate(), __privateSet(this, _e, null), this.loaded = false);
    });
    __publicField(this, "writeFile", (t, e, { signal: a } = {}) => {
      const n = [];
      return e instanceof Uint8Array && n.push(e.buffer), __privateGet(this, _t).call(this, { type: s.WRITE_FILE, data: { path: t, data: e } }, n, a);
    });
    __publicField(this, "mount", (t, e, a) => {
      const n = [];
      return __privateGet(this, _t).call(this, { type: s.MOUNT, data: { fsType: t, options: e, mountPoint: a } }, n);
    });
    __publicField(this, "unmount", (t) => {
      const e = [];
      return __privateGet(this, _t).call(this, { type: s.UNMOUNT, data: { mountPoint: t } }, e);
    });
    __publicField(this, "readFile", (t, e = "binary", { signal: a } = {}) => __privateGet(this, _t).call(this, { type: s.READ_FILE, data: { path: t, encoding: e } }, void 0, a));
    __publicField(this, "deleteFile", (t, { signal: e } = {}) => __privateGet(this, _t).call(this, { type: s.DELETE_FILE, data: { path: t } }, void 0, e));
    __publicField(this, "rename", (t, e, { signal: a } = {}) => __privateGet(this, _t).call(this, { type: s.RENAME, data: { oldPath: t, newPath: e } }, void 0, a));
    __publicField(this, "createDir", (t, { signal: e } = {}) => __privateGet(this, _t).call(this, { type: s.CREATE_DIR, data: { path: t } }, void 0, e));
    __publicField(this, "listDir", (t, { signal: e } = {}) => __privateGet(this, _t).call(this, { type: s.LIST_DIR, data: { path: t } }, void 0, e));
    __publicField(this, "deleteDir", (t, { signal: e } = {}) => __privateGet(this, _t).call(this, { type: s.DELETE_DIR, data: { path: t } }, void 0, e));
  }
  on(t, e) {
    t === "log" ? __privateGet(this, _s).push(e) : t === "progress" && __privateGet(this, _n).push(e);
  }
  off(t, e) {
    t === "log" ? __privateSet(this, _s, __privateGet(this, _s).filter((a) => a !== e)) : t === "progress" && __privateSet(this, _n, __privateGet(this, _n).filter((a) => a !== e));
  }
}
_e = new WeakMap();
_a = new WeakMap();
_r = new WeakMap();
_s = new WeakMap();
_n = new WeakMap();
_o = new WeakMap();
_t = new WeakMap();
var l;
(function(r) {
  r.MEMFS = "MEMFS", r.NODEFS = "NODEFS", r.NODERAWFS = "NODERAWFS", r.IDBFS = "IDBFS", r.WORKERFS = "WORKERFS", r.PROXYFS = "PROXYFS";
})(l || (l = {}));
const L = new Error("failed to get response body reader"), w = new Error("failed to complete download"), I = "Content-Length", A = (r) => new Promise((t, e) => {
  const a = new FileReader();
  a.onload = () => {
    const { result: n } = a;
    n instanceof ArrayBuffer ? t(new Uint8Array(n)) : t(new Uint8Array());
  }, a.onerror = (n) => {
    var _a2, _b;
    e(Error(`File could not be read! Code=${((_b = (_a2 = n == null ? void 0 : n.target) == null ? void 0 : _a2.error) == null ? void 0 : _b.code) || -1}`));
  }, a.readAsArrayBuffer(r);
}), b = async (r) => {
  let t;
  if (typeof r == "string") /data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(r) ? t = atob(r.split(",")[1]).split("").map((e) => e.charCodeAt(0)) : t = await (await fetch(r)).arrayBuffer();
  else if (r instanceof URL) t = await (await fetch(r)).arrayBuffer();
  else if (r instanceof File || r instanceof Blob) t = await A(r);
  else return new Uint8Array();
  return new Uint8Array(t);
}, _ = async (r, t) => {
  var _a2;
  const e = await fetch(r);
  let a;
  try {
    const n = parseInt(e.headers.get(I) || "-1"), i = (_a2 = e.body) == null ? void 0 : _a2.getReader();
    if (!i) throw L;
    const d = [];
    let o = 0;
    for (; ; ) {
      const { done: E, value: R } = await i.read(), c = R ? R.length : 0;
      if (E) {
        if (n != -1 && n !== o) throw w;
        t && t({ url: r, total: n, received: o, delta: c, done: E });
        break;
      }
      d.push(R), o += c, t && t({ url: r, total: n, received: o, delta: c, done: E });
    }
    const f = new Uint8Array(o);
    let h = 0;
    for (const E of d) f.set(E, h), h += E.length;
    a = f.buffer;
  } catch (n) {
    console.log("failed to send download progress event: ", n), a = await e.arrayBuffer();
  }
  return a;
}, m = async (r, t, e = false, a) => {
  const n = e ? await _(r, a) : await (await fetch(r)).arrayBuffer(), i = new Blob([n], { type: t });
  return URL.createObjectURL(i);
};
export {
  N as F,
  b as f,
  m as t
};
