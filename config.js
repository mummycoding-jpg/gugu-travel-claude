/* ==========================================================
   GUGU TAXI TOUR & TRAVEL - EDIT YOUR DETAILS HERE
   Change anything below, save, and refresh the page.
   ========================================================== */
window.SITE = {
  businessName: "Gugu Taxi Tour & Travel",
  base: "Siwan, Bihar",

  // Phone number: digits only, with country code (91 = India)
  phoneIntl: "918210403072",
  phoneDisplay: "8210403072",

  // First line of every WhatsApp message customers send you
  whatsappGreeting: "Hello Gugu Taxi Tour & Travel, I want to book your Toyota Rumion.",

  // PRIORITY routes: shown first on the big green board (edit freely)
  priorityRoutes: [
    { to: "Bettiah",   state: "Bihar" },
    { to: "Darbhanga", state: "Bihar" },
    { to: "Madhubani", state: "Bihar" },
    { to: "Siwan",     state: "Bihar" },
    { to: "Gopalganj", state: "Bihar" },
    { to: "Gorakhpur", state: "Uttar Pradesh" },
    { to: "Raxaul",    state: "Bihar" },
    { to: "Supaul",    state: "Bihar" },
    { to: "Gaya",      state: "Bihar" }
  ],

  // Other routes shown as highway signs (add or remove freely)
  routes: [
    { to: "Patna",      state: "Bihar" },
    { to: "Muzaffarpur",state: "Bihar" },
    { to: "Varanasi",   state: "Uttar Pradesh" },
    { to: "Lucknow",    state: "Uttar Pradesh" },
    { to: "Prayagraj",  state: "Uttar Pradesh" },
    { to: "Ayodhya",    state: "Uttar Pradesh" },
    { to: "Kanpur",     state: "Uttar Pradesh" },
    { to: "Delhi NCR",  state: "Delhi" },
    { to: "Ranchi",     state: "Jharkhand" },
    { to: "Jamshedpur", state: "Jharkhand" },
    { to: "Kolkata",    state: "West Bengal" }
  ],

  // Rates. These are SAMPLE prices - put your real prices here.
  // Set showRates to false to hide the whole rates section.
  showRates: true,
  rates: [
    { label: "Local, Siwan",         price: "₹900",   unit: "for 4 hours" },
    { label: "Siwan to Patna",       price: "₹3,500", unit: "one way" },
    { label: "Outstation",           price: "₹14",    unit: "per km" },
    { label: "Round trip",           price: "₹4,500", unit: "per day" },
    { label: "Airport / station pickup", price: "₹1,200", unit: "per trip" }
  ]
};
