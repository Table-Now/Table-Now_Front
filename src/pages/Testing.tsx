import React, { useState, useEffect } from "react";
import { reservationApi, ReservationDto } from "../api/reservation";
import { useUser } from "../hooks/useUser";

const ReservationChecker = () => {
  const { user } = useUser();
  console.log(user);
  const [reservations, setReservations] = useState<ReservationDto[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await reservationApi.getReservations(user);
        setReservations(reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [user]);

  return (
    <div>
      <h2>Your Reservations</h2>
      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <p>Reservation Date: {reservation.reservationDate}</p>
              <p>Status: {reservation.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
};

export default ReservationChecker;
