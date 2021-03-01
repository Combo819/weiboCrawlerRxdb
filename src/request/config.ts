import axios, { AxiosInstance } from "axios";
import {  baseUrl } from "../config";

interface Headers {
  "User-Agent": String;
}

interface DownloadHeader {
  "User-Agent":string
}

const header: Headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
};

const downloadHeader:DownloadHeader = {
  "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"
}

const crawlerAxios: AxiosInstance = axios.create({
  baseURL: baseUrl,
  //headers: header,
});

const downloadAxios: AxiosInstance = axios.create({
  //headers:downloadHeader,
});


[crawlerAxios,downloadAxios].forEach((item:AxiosInstance) => {
  item.interceptors.request.use(request => {
    if(axios.defaults.headers.common['cookie']){
      request.headers['cookie'] = axios.defaults.headers.common['cookie'];
    }
    return request
  })
});

export { crawlerAxios,downloadAxios,axios };
