const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const { sendEmail } = require("./sendGridController")
//const { sendSMS } = require("./twilioController")

const userPost = async (req, res) => {
  try {
    const { email, name, password, phoneNumber } = req.body;
    const role = "usuario"
    const verified = false;
    const twoFactorAuthenticate = true;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'El email ya existe' });
    }

    const user = new User({ email, name, password, phoneNumber, role, verified, twoFactorAuthenticate });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
    sendEmail(email);
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
}

const userPut = async (req, res) => {
  const { id } = req.params;

  try {
    const { email } = req.body;
    const { name } = req.body;
    const { password } = req.body;
    const { phone_number } = req.body;
    await User.findByIdAndUpdate(id, { email, name, password, phone_number });
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

const userGet = async (req, res) => {
  if (req.query && req.query.email) {
    User.findOne({ email: req.query.email }, function (err, teacher) {
      if (err) {
        res.status(404);
        console.log('error while querying the teacher', err);
        res.json({ error: "Teacher doesn't exist" });
      } else {
        res.json(teacher);
      }
    });
  } else if (req.query && req.query.id) {
    User.findById(req.query.id, function (err, teacher) {
      if (err) {
        res.status(404);
        console.log('error while querying the teacher', err);
        res.json({ error: "Teacher doesn't exist" });
      } else {
        res.json(teacher);
      }
    });
  } else {
    try {
      const users = await User.find({ role: { $ne: 'administrador' } }, { password: 0 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
    }
  }
};

const userDelete = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden eliminar usuarios.' });
  }
  try {
    await User.findByIdAndRemove(id);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  if (user.role === 'user' && user.verified === false) {
    return res.status(200).json({ message: 'Wait for the administrator verification or verify yourself with the email we sent you' });
  }

  if (user.twoFactorAuthenticate === true) {
    //sendSMS(user.phone_number);
  }

  const token = jwt.sign({ email: user.email, name: user.username, phone_number : user.phone_number, role: user.role, verified: user.verified, twoFactorAuthenticate : user.twoFactorAuthenticate, _id: user._id }, 'clave-secreta-del-jwt');
  res.json({ token, role: user.role, verified: user.verified, twoFactorAuthenticate: user.twoFactorAuthenticate, _id: user._id });
  
};

const userVerification = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.verified = true;
    await user.save();
    res.json({ message: 'Usuario verificado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar el usuario' });
  }
};

const desactivate2fa = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorAuthenticate = false;
    await user.save();
    res.json({ message: 'Two-Step Verification successfully disabled' });
  } catch (err) {
    res.status(500).json({ message: 'Error disabling two-step verification' });
  }
};

module.exports = {
  userPost,
  userPut,
  userGet,
  userDelete,
  userLogin,
  userVerification,
  desactivate2fa
}