import StorageUtil from '@/utils/storageUtil'

const EnterpriseKey = 'Enterprise';
export function getEnterprise() {
    if(StorageUtil.getItem(EnterpriseKey)){
        return JSON.parse(StorageUtil.getItem(EnterpriseKey));
    }
}

export function setEnterprise(Enterprise) {
  return StorageUtil.setItem(EnterpriseKey, JSON.stringify(Enterprise));
}

export function removeEnterprise() {
  return StorageUtil.removeItem(EnterpriseKey);
}
