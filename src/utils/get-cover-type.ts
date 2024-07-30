import { ECoverType } from "@/enums/ECoverType";

export function getCoverType(type: ECoverType) {
  // @ts-ignore
  let key: keyof typeof ECoverType = type;

  return ECoverType[key];
}
