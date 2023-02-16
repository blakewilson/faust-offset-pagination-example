import { setConfig } from "@faustwp/core";
import possibleTypes from "./possibleTypes.json";

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  experimentalPlugins: [],
  possibleTypes,
});
