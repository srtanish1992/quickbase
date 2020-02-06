
const getLocalData = key => {
    return JSON.parse(localStorage.getItem(key));
  };
  
const saveLocalData = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

const clearLocalData = key => {
  localStorage.removeItem(key);
}

const Cache = { getLocalData, saveLocalData, clearLocalData};

export default Cache;