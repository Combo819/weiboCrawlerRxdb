## A typescript weiboo crawler
#### prerequisite
1. a mongo db, parse the mongo db uri to `src/config.ts` as `URI`
2. nodejs, v12.16.3
3. npm, v6.14.4
#### run the app
1. open `m.weibo.cn`, log in and copy the cookie from any http request.
2. create a json file `src/credential.json`, add the token copied from cookie to the json file
3. add the mongodb uri in the `src/credential.json`
```json
{
    "cookie":"a_very_long_string",
    "URI":"mongodb://localhost:27017"
}
```
4. run `npm i`
5. run `npm run start:dev` to start the crawler server
6. go to [weibo-crawler-react](https://github.com/Combo819/weibo-crawler-react) to clone the front end

#### serve the images and videos
nginx config in `/etc/nginx/sites-enabled`  
`sudo vim default` to edit the config file
template 
```
# Default server configuration
#
server {
        listen 80 default_server;
        location /images/ {
                # set root as the path of folder which contains the images folder. Usually set it as the staticPath on your src/config.ts
                root THE_ABSOLUTE_PATH_OF_FOLDER_WHICH_CONTAINS_images_FOLDER;
        }
        location /videos/ {
                # set root as the path of folder which contains the video folder. Usually set it as the staticPath on your src/config.ts
                root THE_ABSOLUTE_PATH_OF_FOLDER_WHICH_CONTAINS_videos_Folder;
        }
}
```
then save it and run `sudo service nginx restart`