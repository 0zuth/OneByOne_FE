import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * 로컬 상태를 즉시 업데이트하고, 서버 응답이 오면 동기화
 *
 * 롤백 함수로 에러 발생 시 이전 상태 복구
 *
 * @param initialValue - 초기값
 * @param serverValue - 서버에서 받아온 실제 값
 * @returns [value, setValue, rollback]
 */
export function useOptimisticUpdate<T>(
  initialValue: T,
  serverValue?: T
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(initialValue);
  const previousValueRef = useRef<T>(initialValue);

  // 값이 변경되기 전 이전 값 저장
  const setValueWithHistory = useCallback((action: SetStateAction<T>) => {
    setValue((prev) => {
      previousValueRef.current = prev;
      return typeof action === "function"
        ? (action as (prev: T) => T)(prev)
        : action;
    });
  }, []);

  const rollback = useCallback(() => {
    setValue(previousValueRef.current);
  }, []);

  useEffect(() => {
    if (serverValue !== undefined) {
      previousValueRef.current = serverValue;
      setValue(serverValue);
    }
  }, [serverValue]);

  return [value, setValueWithHistory, rollback];
}
