const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // =====================================================
    // OBTENER TOKEN
    // =====================================================

    // Mobile:
    // Authorization: Bearer <token>

    const authHeader = req.headers.authorization;

    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    // Web:
    // Cookie: accessToken
    const cookieToken = req.cookies?.accessToken;

    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        message: "Token requerido",
      });
    }

    // =====================================================
    // VERIFICAR TOKEN
    // =====================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =====================================================
    // GUARDAR USUARIO AUTENTICADO
    // =====================================================

    req.user = decoded;

    // Debug temporal
    console.log("USUARIO AUTENTICADO:", {
      id: req.user?.id,
      rol: req.user?.rol,
      email: req.user?.email,
    });

    next();
  } catch (error) {
    console.error(
      "ERROR VERIFY TOKEN:",
      error.message
    );

    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};

module.exports = verifyToken;