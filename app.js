const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// In-memory data storage
let rooms = [];
let bookings = [];

app.use(bodyParser.json());

// 1. Create a Room
app.post('/create-room', (req, res) => {
  const { roomName, seats, amenities, pricePerHour } = req.body;
  const room = {
    roomName,
    seats,
    amenities,
    pricePerHour,
    roomId: rooms.length + 1,
  };
  rooms.push(room);
  res.json({ success: true, room });
});

// 2. Booking a Room
app.post('/book-room', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const room = rooms.find((r) => r.roomId === roomId);
  console.log(room);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  const booking = {
    customerName,
    date,
    startTime,
    endTime,
    roomId,
    bookingId: bookings.length + 1,
  };
  bookings.push(booking);
  res.json({ success: true, booking });
});

// 3. List all Rooms with Booked Data
app.get('/list-rooms', (req, res) => {
  const roomList = rooms.map((room) => {
    const bookedData = bookings.find((booking) => booking.roomId === room.roomId);
    return {
      roomName: room.roomName,
      bookedStatus: bookedData ? 'Booked' : 'Available',
      customerName: bookedData ? bookedData.customerName : null,
      date: bookedData ? bookedData.date : null,
      startTime: bookedData ? bookedData.startTime : null,
      endTime: bookedData ? bookedData.endTime : null,
    };
  });
  res.json(roomList);
});

// 4. List all Customers with Booked Data
app.get('/list-customers', (req, res) => {
  const customerList = bookings.map((booking) => {
    const room = rooms.find((r) => r.roomId === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: room ? room.roomName : null,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });
  res.json(customerList);
});

// 5. List how many times a customer has booked the room
app.get('/customer-booking-history/:customerName', (req, res) => {
  const customerName = req.params.customerName;
  const customerBookingHistory = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => {
      const room = rooms.find((r) => r.roomId === booking.roomId);
      return {
        customerName: booking.customerName,
        roomName: room ? room.roomName : null,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.bookingId,
        bookingDate: new Date().toISOString(), // You can replace this with the actual booking date
        bookingStatus: 'Booked',
      };
    });
  res.json(customerBookingHistory);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
