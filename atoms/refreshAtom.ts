import { atom } from "recoil";

export const refreshAtom = atom<number>({
  key: "refreshAtomState",
  default: 0,
});
