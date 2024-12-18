import React from "react";
import styled from "styled-components";

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
`;

const TabButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active", // active는 DOM으로 전달되지 않음
})<{ active: boolean }>`
  flex: 1;
  padding: 15px 0;
  border: none;
  color: #34495e;
  background-color: #f9f9f9;
  font-weight: normal;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  ${(props) =>
    props.active &&
    `
    color: black;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: #8d8d8d;
    }
  `}
`;

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabContainer>
      <TabButton
        active={activeTab === "home"}
        onClick={() => onTabChange("home")}
      >
        홈
      </TabButton>
      <TabButton
        active={activeTab === "menu"}
        onClick={() => onTabChange("menu")}
      >
        메뉴
      </TabButton>
      <TabButton
        active={activeTab === "review"}
        onClick={() => onTabChange("review")}
      >
        리뷰
      </TabButton>
    </TabContainer>
  );
};

export default Tabs;
