import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/user";
import { MyInfoResponse } from "../../types/users/myInfo";
import { MyInfoUpdate } from "../../types/users/myInfo";
import Button from "../../components/Button";
import { useUser } from "../../hooks/useUser";

const Mypage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role } = useUser();

  const [userInfo, setUserInfo] = useState<MyInfoResponse | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState<MyInfoUpdate>({
    phone: "",
  });

  const fetchUserInfo = async () => {
    try {
      if (user) {
        const info = await userApi.getMyInfo(user);
        setUserInfo(info);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      alert("사용자 정보를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  const handleUpdateInfo = async () => {
    try {
      await userApi.updateUser(phoneUpdate?.phone);
      alert("정보가 성공적으로 수정되었습니다.");
      setShowResetModal(false);
      fetchUserInfo();
    } catch (error) {
      alert("정보 수정에 실패했습니다. 다시 한번 확인해 주세요");
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        await userApi.deleteUser(user);
        alert("계정이 성공적으로 탈퇴되었습니다.");
        setShowDeleteModal(false);
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      alert("계정 탈퇴에 실패했습니다.");
      console.error(error);
    }
  };

  const logoutHandler = async () => {
    await userApi.kakaoLogout(sessionStorage.getItem("kakaoAccessToken"));
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Container>
      <UserInfoSection>
        <h2>내 정보</h2>
        {userInfo && (
          <InfoGrid>
            <InfoItem>
              <Label>아이디:</Label>
              <Value>{userInfo.user}</Value>
            </InfoItem>
            <InfoItem>
              <Label>이메일:</Label>
              <Value>{userInfo.email}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Phone:</Label>
              <Value>{userInfo.phone}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Type:</Label>
              <Value>{userInfo.role}</Value>
            </InfoItem>
            <InfoItem>
              <Label>가입일:</Label>
              <Value>{new Date(userInfo.createAt).toLocaleDateString()}</Value>
            </InfoItem>
          </InfoGrid>
        )}
      </UserInfoSection>

      <ButtonBox>
        {role === "USER" && (
          <>
            <Button
              type="button"
              onClick={() => navigate(`/my/reservation/list/${user}`)}
            >
              예약 현황
            </Button>
          </>
        )}
        {role === "USER" && (
          <>
            <Button
              type="button"
              onClick={() => navigate(`/my/wishlist/${user}`)}
            >
              찜 목록
            </Button>
          </>
        )}
        {role === "MANAGER" && (
          <>
            <Button
              type="button"
              onClick={() => navigate(`/store/manager/list/${user}`)}
            >
              매장 목록
            </Button>
          </>
        )}
        <Button type="button" onClick={logoutHandler}>
          로그아웃
        </Button>
        <Button onClick={() => setShowResetModal(true)}>내 정보 수정</Button>
        <Button onClick={() => setShowDeleteModal(true)}>회원 탈퇴</Button>
      </ButtonBox>

      {showResetModal && (
        <>
          <Backdrop onClick={() => setShowResetModal(false)} />
          <Modal>
            <h2>내 정보 수정</h2>
            <Input
              type="tel"
              placeholder="전화번호"
              value={phoneUpdate.phone}
              onChange={(e) =>
                setPhoneUpdate({
                  ...phoneUpdate,
                  phone: e.target.value,
                })
              }
            />
            <ButtonBox1>
              <Button onClick={handleUpdateInfo}>확인</Button>
              <Button onClick={() => setShowResetModal(false)}>취소</Button>
            </ButtonBox1>
          </Modal>
        </>
      )}

      {showDeleteModal && (
        <>
          <Backdrop onClick={() => setShowDeleteModal(false)} />
          <Modal>
            <h2>회원 탈퇴</h2>
            <p>정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <ButtonBox1>
              <Button onClick={handleDeleteAccount}>확인</Button>
              <Button onClick={() => setShowDeleteModal(false)}>취소</Button>
            </ButtonBox1>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default Mypage;

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserInfoSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.5rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;

const Label = styled.span`
  width: 100px;
  font-weight: bold;
  color: #666;
`;

const Value = styled.span`
  color: #333;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ButtonBox1 = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;
