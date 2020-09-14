import {IUser,UserDocument} from '../../database/collections';
import {database} from '../../database/connect'
import downloadImage from '../downloader/image';
import {staticPath} from '../../config'
/**
 * save the user to the MongoDB
 * @param user the user object from weibo or comment for subcomment
 */
export function saveUser(user: any) {
  return new Promise(async (resolve, reject) => {
    const {
      id,
      screenName,
      profileUrl,
      gender,
      followersCount,
      followCount,
      profileImageUrl,
      avatarHd,
    } = user;
    const newUser:IUser = {
      _id: id,
      id,
      screenName,
      profileUrl,
      gender,
      followersCount,
      followCount,
      profileImageUrl,
      avatarHd,
    }
    if(!database){
      return reject('database is not created')
    }
    try{
      const userDoc:UserDocument = await database.user.insert(newUser);
      downloadImage(avatarHd,staticPath);
      resolve(userDoc);
    }catch(err){
      reject('failed to insert user '+screenName)
    }
  });
}
