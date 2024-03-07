export function setProperty(list: any[], itemId: Number, prop: 'isSelected' | 'isActive'): any[] {
  const listClone: any[] = clone(list);

  listClone.forEach(item => {
    item[prop] = item.data.id === itemId;
  });

  return listClone;
}

export function toggleProperty(list: any[], itemId: Number, prop: 'isSelected' | 'isActive'): any[] {
  const listClone: any[] = clone(list);

  listClone.forEach(item => {
    item[prop] = item.data.id === itemId ? !item[prop] : false;
  });

  return listClone;
}

/**
 * @description Clone deeply any variable
 */
export function clone(src: any) {
  const result: any = Array.isArray(src) ? [] : typeof src === 'object' && src !== null ? {} : false;

  if (!result) {
    return src;
  }

  for (const p in src) {
    if ((typeof src[p] === 'object' && src.hasOwnProperty(p)) || Array.isArray(src[p])) {
      result[p] = clone(src[p]);
    } else {
      result[p] = src[p];
    }
  }

  return result;
}
