import { writable, get } from "svelte/store";

export class ObjectCache {
  constructor(x) {
    this.data = writable(x === null | x === undefined ? {"objects": {}, "object_count": null, "keep_count": null} : x)
    // this.objects = objs === undefined ? {} : objs;
    // this.object_count = obj_cnt === undefined ? 0 : obj_cnt;
    // this.keep_count = keep_cnt === undefined ? -1 : keep_cnt
    return this
  }

  fromString(x) {
    var y = JSON.parse(x);
    // return new ObjectCache(y["objects"], y["object_count"], y["keep_count"]);
    return new ObjectCache(y);
  }

  toString() {
    return JSON.stringify(this)
  }

  exists(ik) {
    if (Object.keys(this.objects).includes(ik)) {
      return true
    }
    return false
  }

  get(k) {
    if (this.exists(k)) {
      var v = this.objects[k];
      v["hit_count"] += 1;
      this.objects[k] = v;
      return v["value"]
    }
    return undefined
  }

  set(k, v) {
    // keep only 3 most used objects
    if (this.object_count >= this.keep_count) {
      // get least used object
      var min_count;
      var itr = 0;
      var min_key;
      Object.entries(this.objects).forEach(([key, val]) => {
        // first iteration is baseline
        if (itr == 0) {
          min_count = val["hit_count"];
        }
        if (val["hit_count"] < min_count) {
          min_count = val["hit_count"];
          min_key = key;
        }

        ++itr
      });
      // remove least used object
      delete this.objects[min_key];
      // add new object
      this.objects[k] = v;
    } else {
      this.object_count += 1;
    }
    // always set new object
    this.objects[k] = {"hit_count": 0, "value": v};
  }
}

// // init object
// var x = new ObjectCache();
//
// // set values
// x.set("a", 1)
// x.set("b", 2)
// x.set("c", 3)
//
// // get values to increment hit counts
//
// // set a hit count = 3
// x.get("a")
// x.get("a")
// x.get("a")
//
// // set b hit_count = 1
// x.get("b")
//
// // set c hit count = 2
// x.get("c")
// x.get("c")
//
// // set new value which should drop b
// x.set("d", 4)
//
// // check that b is not returned
// x.get("b")
