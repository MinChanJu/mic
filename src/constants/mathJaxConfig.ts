export const mathJaxConfig = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    packages: { "[+]": ["ams"] }  // ✅ AMS 패키지 활성화
  },
  loader: { load: [] }  // ✅ AMS는 기본 내장되어 있으므로 추가 로드 불필요
};