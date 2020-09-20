import { useRouter } from "next/router";

export default function useHash() {
  const { asPath } = useRouter();
  return (asPath.split("/")[1] === "#" && asPath.split("/")[2]) || "";
}
