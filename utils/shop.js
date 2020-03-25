import StorageUtil from '@/utils/storageUtil'

const ShopKey = 'ShopSnap';

export function getShop() {
    if(StorageUtil.getItem(ShopKey)){
        return JSON.parse(StorageUtil.getItem(ShopKey));
    }
}

export function setShop(Shop) {
  return StorageUtil.setItem(ShopKey, JSON.stringify(Shop));
}

export function removeShop() {
  return StorageUtil.removeItem(ShopKey);
}
