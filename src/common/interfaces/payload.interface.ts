export interface PayloadType {
  sub: string;
  email: string;
}

export interface ReqWithPayloadType extends Request {
  user: PayloadType;
}
