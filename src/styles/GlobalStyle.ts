import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100vh;
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    color: #333;
    overflow-x: hidden;
    padding-bottom: 50px; /* 헤더의 높이만큼 공간 추가 */
  }

  #root, .app-container {
    max-width: 768px;
    margin: 0 auto;
    overflow-x: hidden;
  }

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

  @media (max-width: 768px) {
    #root, .app-container {
      padding: 0 1rem;
    }
  }

  @media (max-width: 400px) {
    html, body {
      font-size: 0.9rem;
    }
  }
`;

export default GlobalStyle;
