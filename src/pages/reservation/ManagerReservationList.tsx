import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { reservationListApi } from "../../api/reservation";
import { ReservationRosterType } from "../../types/reservation/reservationRoster";
import { useParams } from "react-router-dom";

const ManagerReservationList: React.FC = () => {
  const { store } = useParams<{ store: string }>();
  const [reservations, setReservations] = useState<ReservationRosterType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (store) {
          setIsLoading(true);
          const data = await reservationListApi.reservationList(store);
          setReservations(data);
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch reservations");
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [store]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ReservationListContainer>
      <Title>Reservation Waiting List</Title>
      {reservations.length === 0 ? (
        <NoReservationsMessage>No reservations found</NoReservationsMessage>
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Waiting Number</TableHeaderCell>
              <TableHeaderCell>Store</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>People</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.waitingNumber}>
                <TableCell>{reservation.waitingNumber}</TableCell>
                <TableCell>{reservation.store}</TableCell>
                <TableCell>{reservation.phone}</TableCell>
                <TableCell>{reservation.peopleNb}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </ReservationListContainer>
  );
};

export default ManagerReservationList;

const ReservationListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: #f0f0f0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  border: 1px solid #ddd;
  background-color: #f0f0f0;
  font-weight: bold;
`;

const NoReservationsMessage = styled.p`
  text-align: center;
  color: #666;
  margin-top: 20px;
`;
