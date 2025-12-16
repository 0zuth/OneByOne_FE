const STORAGE_KEYS = {
  RETURN_URL: "sidebar_return_url",
  SHOULD_OPEN: "sidebar_should_open",
} as const;

export function saveReturnUrl(url: string) {
  sessionStorage.setItem(STORAGE_KEYS.RETURN_URL, url);
}

export function getReturnUrl(): string | null {
  return sessionStorage.getItem(STORAGE_KEYS.RETURN_URL);
}

export function clearReturnUrl() {
  sessionStorage.removeItem(STORAGE_KEYS.RETURN_URL);
}

// 사이드바 자동 열기 플래그 설정
export function setShouldOpenSidebar(value: boolean) {
  if (value) {
    sessionStorage.setItem(STORAGE_KEYS.SHOULD_OPEN, "true");
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.SHOULD_OPEN);
  }
}

// 사이드바 자동 열기 플래그 확인 후 제거
export function consumeShouldOpenSidebar(): boolean {
  const shouldOpen =
    sessionStorage.getItem(STORAGE_KEYS.SHOULD_OPEN) === "true";
  sessionStorage.removeItem(STORAGE_KEYS.SHOULD_OPEN);
  return shouldOpen;
}
