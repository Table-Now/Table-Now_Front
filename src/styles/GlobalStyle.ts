import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    color: #333;
    overflow-x: hidden;
  }

  /* 모바일 중심 뷰포트 스타일링 */
  body {
    max-width: 768px; /* 최대 너비: 태블릿 크기 */
    margin: 0 auto;
  }

  /* 글꼴 및 기본 텍스트 스타일 */
  h1, h2, h3, h4, h5, h6 {
    color: #222;
    font-weight: bold;
  }

  p {
    line-height: 1.5;
    font-size: 1rem;
    color: #555;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* 반응형 스타일 */
  @media (max-width: 768px) {
    body {
      padding: 0 1rem; /* 태블릿 이하의 여백 */
    }
  }

  @media (max-width: 400px) {
    html, body {
      font-size: 0.9rem; /* 최소 너비에서 폰트 크기 축소 */
    }
  }
`;

export default GlobalStyle;
