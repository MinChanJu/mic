interface ErrorPageProps {
  big?: number;
  small?: number;
  weight?: number;
  message?: string;
  subMessage?: string;
  marginTop?: number;
  marginBottom?: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ big, small, weight, message, subMessage, marginTop, marginBottom }) => {
  big = big != null ? big : 80
  small = small != null ? small : 20
  weight = weight != null ? weight : 600
  message = message != null ? message : "404 에러"
  subMessage = subMessage != null ? subMessage : "서버 오류 또는 권한 없음"
  marginTop = marginTop != null ? marginTop : 200

  return (
    <div className="center" style={{ marginTop: `${marginTop}px`, marginBottom: `${marginBottom == null ? 'auto' : `${marginBottom}px`}` }}>
      <div className="blue" style={{ fontSize: `${big}px`, fontWeight: `${weight}` }}>{message}</div>
      <br />
      <div className="red" style={{ fontSize: `${small}px`, fontWeight: `${weight}` }}>{subMessage}</div>
    </div>
  )
}

export default ErrorPage;