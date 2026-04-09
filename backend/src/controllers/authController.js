const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, RefreshToken } = require("../models");
const { signAccessToken, signRefreshToken, hashToken } = require("../utils/tokens");
const { logAudit } = require("../utils/audit");

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth/refresh-token",
};

const getRefreshExpiryDate = () => {
  const expires = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
  const value = parseInt(expires, 10);
  if (expires.endsWith("d")) return new Date(Date.now() + value * 24 * 60 * 60 * 1000);
  if (expires.endsWith("h")) return new Date(Date.now() + value * 60 * 60 * 1000);
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    await logAudit({ userId: user.id, action: "REGISTER", entity: "User", entityId: user.id });

    return res.status(201).json({
      message: "Registered successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user.id });
    const tokenHash = hashToken(refreshToken);

    await RefreshToken.create({
      userId: user.id,
      tokenHash,
      expiresAt: getRefreshExpiryDate(),
    });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    await logAudit({ userId: user.id, action: "LOGIN", entity: "User", entityId: user.id });
    return res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const incomingToken = req.cookies.refreshToken;
    if (!incomingToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const existing = await RefreshToken.findOne({
      where: { tokenHash: hashToken(incomingToken), userId: decoded.id },
      include: [{ model: User, as: "user" }],
    });

    if (!existing || existing.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh token expired or revoked" });
    }

    const user = existing.user;
    const newRefreshToken = signRefreshToken({ id: user.id });
    const newRefreshHash = hashToken(newRefreshToken);
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await existing.destroy();
    await RefreshToken.create({
      userId: user.id,
      tokenHash: newRefreshHash,
      expiresAt: getRefreshExpiryDate(),
    });

    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const incomingToken = req.cookies.refreshToken;
    if (incomingToken) {
      await RefreshToken.destroy({ where: { tokenHash: hashToken(incomingToken) } });
    }
    await logAudit({ userId: req.user?.id || null, action: "LOGOUT", entity: "User" });
    res.clearCookie("refreshToken", refreshCookieOptions);
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
