const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendstatus(204); //No content
  const refreshToken = cookies.jwt;

  // is refresh token in db?
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  }); //secure: true - only serves on https

  res.sendStatus(204);
};

module.exports = { handleLogout };
