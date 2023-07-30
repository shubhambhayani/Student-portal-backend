var  jwt=require('jsonwebtoken');
const dbConfig = require('../../dbConfig');
const JWT_SECRET="shubham@bhayani";


const Fetchuser= (requiredRole) => {
    return async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
      return res.status(401).send({ error: "Please authenticate with a valid token" });
    }
    try {
      const data = jwt.verify(token, JWT_SECRET);
      const [rows] = await dbConfig.execute('SELECT * FROM users WHERE id = ?', [data.user.id]);
      const user = rows[0];
      if (!user) {
        return res.status(401).send({ error: "Please authenticate with a valid token" });
      }
      req.user = user;

      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).send({ error: "You don't have permission to access this resource" });
      }
      next();
    } 
    catch (error) {
      console.error(error.message);
      res.status(401).send({ error: "Please authenticate with a valid token" });
    }
}
  };

  module.exports = Fetchuser;
  