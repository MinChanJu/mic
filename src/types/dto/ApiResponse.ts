export interface ApiResponse<T> {
  status: number;    // HTTP 상태 코드 (200, 400, 500 등)
  success: boolean;  // 성공 여부
  message: string;   // 응답 메시지
  data: T;           // 제네릭 타입의 데이터
}