export const SOCKET_EVENTS = Object.freeze({

  CONNECT:    "connect",
  DISCONNECT: "disconnect",

  USER_ONLINE:       "user:online",
  USER_OFFLINE:      "user:offline",
  USERS_ONLINE_LIST: "users:onlineList",

  
  ROOM_JOIN:           "room:join",
  ROOM_JOINED:         "room:joined",
  ROOM_CREATE_PRIVATE: "room:createPrivate",
  ROOM_CREATE_GROUP:   "room:createGroup",
  ROOM_CREATED:        "room:created",
  ROOM_UPDATED:        "room:updated",
  ROOM_LEAVE:          "room:leave",

  MESSAGE_SEND:    "message:send",
  MESSAGE_RECEIVE: "message:receive",
  MESSAGE_READ:    "message:read",

  TYPING_START: "typing:start",
  TYPING_STOP:  "typing:stop",

 
  NEW_NOTIFICATION:       "new_notification",
  UNREAD_NOTIFICATIONS:   "unread_notifications",
  MARK_NOTIFICATION_READ: "mark_notification_read",

  BOOKING_CREATED:   "booking_created",
  BOOKING_ACCEPTED:  "booking_accepted",
  BOOKING_REJECTED:  "booking_rejected",
  BOOKING_COMPLETED: "booking_completed",
  BOOKING_CANCELLED: "booking_cancelled",


  OFFER_CREATED:  "offer_created",
  OFFER_ACCEPTED: "offer_accepted",
  OFFER_REJECTED: "offer_rejected",


  ERROR: "error",
});
