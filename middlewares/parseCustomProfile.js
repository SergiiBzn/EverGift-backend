const parseCustomProfile = (req, res, next) => {
  if (req.body?.customProfile && typeof req.body.customProfile === "string") {
    try {
      req.body.customProfile = JSON.parse(req.body.customProfile);
    } catch (error) {
      return res.status(400).json({ message: "Invalid custom profile JSON" });
    }
  }

  next();
};

export default parseCustomProfile;
