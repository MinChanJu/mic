import { CSSProperties } from 'react';

interface loadingProps {
  width?: number;
  border?: number;
  baseColor?: string;
  lineColor?: string;
  marginTop?: number;
  marginBottom?: number;
}

const Loading = ({ width, border, baseColor, lineColor, marginTop, marginBottom }: loadingProps) => {
  width = width ? width : 20
  border = border ? border : 3
  baseColor = baseColor ? baseColor : "gray"
  lineColor = lineColor ? lineColor : "black"
  marginTop = marginTop != null ? marginTop : 0

  let style: Partial<CSSProperties> = {
    width: `${width}px`,
    border: `${border}px solid ${baseColor}`,
    borderTop: `${border}px solid ${lineColor}`
  };

  return (
    <div className="center" style={{ marginTop: `${marginTop}px`, marginBottom: `${marginBottom == null ? 'auto' : `${marginBottom}px`}` }}>
      <div className="loading" style={style}></div>
    </div>
  )
}

export default Loading;