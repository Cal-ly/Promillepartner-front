import { template } from "./template.js";
import { data } from "./data.js";
import { methods } from "./methods.js";
import { mountedLogic } from './mounted.js';

export default {
  template,
  data,
  methods,
  mountedLogic,
  mounted() {
    // Call the mounted logic from the imported module
    mountedLogic.mounted.call(this);
  }
};
