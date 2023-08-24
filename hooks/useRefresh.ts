import { refreshAtom } from "atoms/refreshAtom";
import { useRecoilState } from "recoil";

export default function useRefresh() {
  const [refresh, setRefresh] = useRecoilState(refreshAtom);

  const refreshState = () => {
    setRefresh((prev: number) => prev + 1);
  };

  return {
    refresh,
    refreshState,
  };
}
