// HttpOnly 쿠키는 JavaScript에서 직접 접근할 수 없으므로
// 서버 API를 통해 인증 상태를 확인해야 합니다.

// 일반 쿠키 관련 유틸리티 함수들 (HttpOnly가 아닌 쿠키용)
export const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

export const setCookie = (name, value, days = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// HttpOnly 쿠키는 서버에서만 접근 가능하므로
// 클라이언트에서는 API 호출을 통해 인증 상태를 확인
export const checkAuthStatus = async () => {
  try {
    const response = await fetch("/api/users/me", {
      method: "GET",
      credentials: "include", // 쿠키를 포함하여 요청
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error("인증 상태 확인 실패:", error)
    return null
  }
}

// 로그아웃 함수
export const performLogout = async () => {
  try {
    const response = await fetch("/api/common/auth/revoke", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.ok
  } catch (error) {
    console.error("로그아웃 실패:", error)
    return false
  }
}
