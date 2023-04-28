export const BASE_URL =
  'http://atron-india.ap-northeast-1.elasticbeanstalk.com';

export const removeDuplicateKeys = (obj, keys) => {
  let dummyObj = {
    ...obj,
  };
  keys.map(key => {
    delete dummyObj[key];
  });
  return dummyObj;
};
