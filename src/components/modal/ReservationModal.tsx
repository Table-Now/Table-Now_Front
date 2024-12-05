import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReservationRequest } from "../../types/reservation/register";
import { reservationApi } from "../../api/reservation";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  user: string;
  storeOpen: string;
  storeClose: string;
  storeWeekOff: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  storeName,
  user,
  storeOpen,
  storeClose,
  storeWeekOff,
}) => {
  const [phone, setPhone] = useState<string>("");
  const [reservationTime, setReservationTime] = useState<string>("");
  const [peopleNb, setPeopleNb] = useState(1);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오는 함수
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const todayDate = getTodayDate();

  // 시간을 10분 단위로 생성하고, 오픈 시간과 클로즈 시간 사이만 보여주기
  useEffect(() => {
    const generateTimeOptions = () => {
      const options = [];
      const [openHour, openMinute] = storeOpen.split(":").map(Number);
      const [closeHour, closeMinute] = storeClose.split(":").map(Number);

      for (let hour = openHour; hour <= closeHour; hour++) {
        const startMinute = hour === openHour ? openMinute : 0;
        const endMinute = hour === closeHour ? closeMinute : 59;

        for (let minute = startMinute; minute <= endMinute; minute += 10) {
          const timeString = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
          options.push(timeString);
        }
      }
      setTimeOptions(options);
    };

    generateTimeOptions();
  }, [storeOpen, storeClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 오늘 날짜와 선택한 시간을 결합
    // const reservationDateTime = `${todayDate}T${reservationTime}:00`;

    const reservationData: ReservationRequest = {
      userId: user,
      phone,
      store: storeName,
      // reservationDateTime,
      peopleNb,
    };

    try {
      await reservationApi.register(reservationData);
      alert("예약이 완료되었습니다.");
      onClose();
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>예약하기: {storeName}</h2>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="phone">전화번호:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="'-'없이 입력해주세요"
            />
          </InputGroup>
          <h4>
            오픈시간 : {storeOpen} ~ {storeClose}
          </h4>
          <h4>휴무일 : {storeWeekOff}</h4>

          {/* <InputGroup>
            <label htmlFor="reservationTime">예약 시간:</label>
            <select
              id="reservationTime"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              required
            >
              <option value="">시간 선택</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </InputGroup> */}

          <InputGroup>
            <label htmlFor="peopleNb">인원 수:</label>
            <input
              type="number"
              id="peopleNb"
              value={peopleNb}
              onChange={(e) => setPeopleNb(Number(e.target.value))}
              min="1"
              required
            />
          </InputGroup>

          <ButtonGroup>
            <Button type="submit">예약하기</Button>
            <Button type="button" onClick={onClose}>
              취소
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReservationModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; // 추가: 모달을 가장 위로 올리기
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  position: relative; // 추가
  z-index: 1001;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;
