import {BASE_URL} from '../../Api/config';
const getImageUrl = (url: string): string => {
    const urlNoQuery = url.split("?")[0];
    const fileName = urlNoQuery.split("/").pop();
    return `${BASE_URL}/images/${fileName}`;
  };

  export {getImageUrl};