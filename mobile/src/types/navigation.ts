export type AuthStackParamList = {
  Splash: undefined;
  Registration: undefined;
  OtpVerification: {mobileNumber: string; isNewUser: boolean};
};

export type MainDrawerParamList = {
  HomeTab: undefined;
  WorkerServices: undefined;
  ProductSales: undefined;
  VehicleWork: undefined;
  Transport: undefined;
  RequestTickets: undefined;
  MyBookings: undefined;
  MyProducts: undefined;
  MyServices: undefined;
  Favourites: undefined;
  Notifications: undefined;
  Profile: undefined;
  EmergencyServices: undefined;
  GovernmentServices: undefined;
  LanguageVoice: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Requests: undefined;
  Chats: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  // Detail screens (push on top)
  WorkerDetail: {id: number};
  ProductDetail: {id: number};
  VehicleWorkDetail: {id: number};
  TransportDetail: {id: number};
  TicketDetail: {id: number};
  Chat: {conversationId: number; otherUserName: string};
  NearbyMap: {listingType?: string};
  RateReview: {listingType: string; listingId: number; listingName: string};
  AddWorkerService: {editId?: number};
  AddProduct: {editId?: number};
  AddVehicleWork: {editId?: number};
  AddTransport: {editId?: number};
  PostRequest: {editId?: number};
  FilterSort: {listingType: string};
};
