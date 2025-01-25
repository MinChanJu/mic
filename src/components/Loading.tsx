import { CSSProperties } from 'react';

interface loadingProps {
    width?: number;
    border?: number;
    baseColor?: string;
    lineColor?: string;
  }

const Loading = ({ width, border, baseColor, lineColor }: loadingProps) => {
    width = width ? width : 20
    border = border ? border : 3
    baseColor = baseColor ? baseColor : "gray"
    lineColor = lineColor ? lineColor : "black"

    let style: Partial<CSSProperties> = {
        width: `${width}px`,
        border: `${border}px solid ${baseColor}`,
        borderTop: `${border}px solid ${lineColor}`
    };

    return (
        <div className="center">
            <div className="loading" style={style}></div>
        </div>
    )
}

export default Loading;