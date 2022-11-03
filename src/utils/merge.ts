interface IObject {
  [key: string]: any
}

export default function mergeInto<T extends IObject>(base: T, object: T): T {
  const result = base;

  for (const key in result) {
    if (!(key in object)) {
      continue;
    }

    if (typeof object[key] === "object") {
      mergeInto(result[key], object[key]);
    } else {
      result[key] = object[key];
    }
  }

  return result;
}
