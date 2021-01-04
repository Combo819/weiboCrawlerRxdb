import {BASE_URL} from '../../Api/config';
const getVideoUrl = (url: string): string => {
    const urlNoQuery = url.split("?")[0];
    const fileName = urlNoQuery.split("/").pop();
    return `${BASE_URL}/videos/${fileName}`;
  };

  export {getVideoUrl}