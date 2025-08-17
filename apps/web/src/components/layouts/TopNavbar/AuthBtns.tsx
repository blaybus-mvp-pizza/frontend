import { useAuth } from "@/hooks/useAuth";
import { MyButton } from "@workspace/ui/components/myButton";
import { useRouter } from "next/navigation";

export function AuthBtns() {
  const { isAuthenticated, login, logout } = useAuth();
  function handleLogin() {
    login({ id: "1", name: "신윤수", email: "ys1014@naver.com" }, "hello");
  }
  function handleLogout() {
    logout();
  }

  const router = useRouter();
  return (
    <>
      {isAuthenticated ? (
        <>
          <MyButton onClick={() => router.push("/mypage")} text="마이페이지" />
          <MyButton onClick={handleLogout} text="로그아웃" />
        </>
      ) : (
        <MyButton onClick={handleLogin} text="로그인/회원가입" />
      )}
    </>
  );
}
