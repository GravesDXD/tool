import StorageUtil from '@/utils/storageUtil'

const UserKey = 'CurrentUser';

export function getUser() {
    if(StorageUtil.getItem(UserKey)){
        return JSON.parse(StorageUtil.getItem(UserKey));
    }
}

export function setUser(user) {
  return StorageUtil.setItem(UserKey, JSON.stringify(user));
}

export function removeUser() {
  return StorageUtil.removeItem(UserKey);
}
