const BookingAcceptData = [
    {
        id: 1,
        service: "Full Body Massage",
        date: "2025-09-05",
        time: "10:00 AM",
        amount: 1,
        image: [require('../assets/hairCut.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png')],
        price: 1200
    },
    {
        id: 2,
        service: "Facial Treatment",
        date: "2025-09-06",
        time: "02:00 PM",
        amount: 1,
        image: [require('../assets/hairCut.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png')],
        price: 800
    },
];

const BookingPendingData = [
    {
        id: 1,
        service: "Full Body Massage",
        date: "2025-09-05",
        time: "10:00 AM",
        amount: 1,
        image: [require('../assets/facial.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png'),
        require('../assets/pending.png')],
        price: 1200
    },
    {
        id: 2,
        service: "Facial Treatment",
        date: "2025-09-06",
        time: "02:00 PM",
        amount: 1,
        image: [require('../assets/facial.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png'),
        require('../assets/pending.png')],
        price: 800
    },
    {
        id: 2,
        service: "Facial Treatment",
        date: "2025-09-06",
        time: "02:00 PM",
        amount: 1,
        image: [require('../assets/facial.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png'),
        require('../assets/pending.png')],
        price: 800
    },
]

const PreviousBookingData = [
    {

        id: 1,
        service: "Full Body Massage",
        date: "2025-09-05",
        time: "10:00 AM",
        amount: 1,
        image: [require('../assets/hairCut.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png'),
        require('../assets/star.png')],
        price: 1200,
        rating : '4.0'
    },
    {
        id: 2,
        service: "Facial Treatment",
        date: "2025-09-06",
        time: "02:00 PM",
        amount: 1,
        image: [require('../assets/hairCut.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png'),
        require('../assets/star.png')],
        price: 800,
        rating : '4.2'
    },
    {
        id: 3,
        service: "Full Body Massage",
        date: "2025-09-05",
        time: "10:00 AM",
        amount: 1,
        image: [require('../assets/hairCut.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png'),
        require('../assets/star.png')],
        price: 1200,
        rating : '3.9'
    },
    {
        id: 4,
        service: "Facial Treatment",
        date: "2025-09-06",
        time: "02:00 PM",
        amount: 1,
        image: [require('../assets/hairCut.png'),
        require('../assets/calender.png'),
        require('../assets/stopwatch-removebg-preview.png'),
        require('../assets/moneyBag2.png'),
        require('../assets/star.png')],
        price: 800,
        rating : '4.1'

    }
]
export { BookingAcceptData, BookingPendingData, PreviousBookingData };
