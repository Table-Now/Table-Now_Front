import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number | undefined;
  longitude: number | undefined;
  storeName: string | undefined;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  latitude,
  longitude,
  storeName,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        renderMap();
      } else {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(renderMap);
        };
        document.head.appendChild(script);
      }
    };

    const renderMap = () => {
      if (mapRef.current && latitude && longitude) {
        // 1. 지도 옵션 설정
        const mapOption = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3, // 지도의 확대 레벨
        };

        // 2. 지도 생성
        const map = new window.kakao.maps.Map(mapRef.current, mapOption);

        // 3. 줌 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        // 4. 지도 타입 컨트롤 추가
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(
          mapTypeControl,
          window.kakao.maps.ControlPosition.TOPRIGHT
        );

        // 5. 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        // 6. 오버레이 커스텀 스타일
        const content = `
        <div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 10px; 
            background-color: #4CAF50; 
            color: white; 
            border-radius: 8px; 
            font-weight: bold; 
            border: 2px solid #006400;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            pointer-events: none; // 추가: 마우스 이벤트 비활성화
        ">
            ${storeName}
        </div>`;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          yAnchor: 1.5,
        });

        // 마커와 오버레이 맵에 추가
        marker.setMap(map);
        customOverlay.setMap(map);
      }
    };

    loadKakaoMap();
  }, [latitude, longitude, storeName]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "300px",
        margin: "20px 0",
        border: "2px solid #ddd", // 지도 테두리
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 박스 그림자
      }}
    />
  );
};

export default KakaoMap;
