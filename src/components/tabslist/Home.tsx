import styled from "styled-components";
import { HomeProps } from "../../types/stores/detail";
import KakaoMap from "../KakaoMap";

const Home: React.FC<HomeProps> = ({ storeDetail }) => {
  const { storeContents, latitude, longitude, store } = storeDetail;

  return (
    <div>
      <KakaoMap latitude={latitude} longitude={longitude} storeName={store} />

      <h3>소개 글</h3>
      <StContents>{storeContents}</StContents>
    </div>
  );
};

export default Home;

const StContents = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
`;
