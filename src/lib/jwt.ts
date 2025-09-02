import { JWTPayload, SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

export async function signAccessToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(encoder.encode(process.env.JWT_ACCESS_SECRET!));
}

export async function signRefreshToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(encoder.encode(process.env.JWT_REFRESH_SECRET!));
}

export async function verifyAccessToken(token: string) {
  return jwtVerify(token, encoder.encode(process.env.JWT_ACCESS_SECRET!));
}

export async function verifyRefreshToken(token: string) {
  return jwtVerify(token, encoder.encode(process.env.JWT_REFRESH_SECRET!));
}
