const authorizeRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    const userRole = req.user?.rol;

    if (!userRole) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!rolesPermitidos.includes(userRole)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    next();
  };
};

module.exports = authorizeRoles;