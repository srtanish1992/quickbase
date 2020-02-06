/**
 * Gets the value using the key from localstorage and returns javascript object.
 *
 * @param {String} key The key used to get the cache value ( data ).
 * @return {Object} Returns javascript object.
 */
const getLocalData = key => {
    return JSON.parse(localStorage.getItem(key));
  };

  /**
 * Stores the kay and value ( string ) into localstorage .
 *
 * @param {String} key The cache key used to retrieve value.
 * @param {Object} value The cache data.
 */
const saveLocalData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * clears the localstorage data
 *
 * @param {String} key The key used to remove the cache data.
 */
const clearLocalData = key => {
  localStorage.removeItem(key);
}

const Cache = { getLocalData, saveLocalData, clearLocalData};

export default Cache;