export function inAuthority(targetId,type,arr) {

  const arrList = type?arr:(JSON.parse(localStorage.getItem('dsa'))||[]);
  for (let i = 0; i < arrList.length; i++) {
    const item = arrList[i];
    if (item.id === targetId) {
      return true;
    }
    if (item.children && item.children.length > 0) {
      const isExistsInChildren = inAuthority(targetId,1,item.children);
      if (isExistsInChildren) {
        return true;
      }
    }
  }
  return false;
}
