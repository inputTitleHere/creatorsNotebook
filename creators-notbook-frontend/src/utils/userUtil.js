/**
 * 입력받은 JWT문자열을 LocalStorage에 token이라는 키로 저장한다.
 * @param {string} jwt : json web token 문자열을 받는다.
 */
export function setJwtToStorage(jwt) {
  localStorage.setItem("token", jwt);
  sessionStorage.setItem("token",jwt);
}

/**
 * localStorage, 또는 sessionStorage에서 JWT를 찾아 반환한다.
 * @returns localStorage에서 회수한 JWT을 반환한다.
 */
export function getJwtFromStorage() {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
}

/**
 * local, session의 Storage에서 JWT를 삭제한다.
 */
export function removeJwtFromStorage(){
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
}