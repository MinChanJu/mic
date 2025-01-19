export const TimeToString = (time: string): string => {
    const event = new Date(time);
    const year = event.getFullYear();
    const month = String(event.getMonth() + 1).padStart(2, "0");
    const day = String(event.getDate()).padStart(2, "0");
    const hours = String(event.getHours()).padStart(2, "0");
    const minutes = String(event.getMinutes()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

export const StringToTime = (formatTime: string): string => {
    const date = new Date(formatTime);
    const timezoneOffset = date.getTimezoneOffset() * 60000;  // 분 단위 오프셋 → ms로 변환
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
}