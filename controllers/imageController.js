const Image = require("../models/imageModel");

const imagePost = async (req, res) => {
    try {
        const { name, prompt, size, user, tags } = req.body;
        const n = 1;

        const image = new Image({ name, prompt, n, size, user, tags });
        await image.save();
        res.status(201).json({ message: 'Image prompt registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el Image prompt' });
    }
}
const imageGet = async (req, res) => {
    if (req.query && req.query.id) {
      Image.findById(req.query.id, function (err, edit) {
        if (err) {
          res.status(404);
          console.log('error while queryting the Image prompt', err)
          res.json({ error: "Image prompt doesnt exist" })
        }
        res.json(edit);
      });
    } else {
      try {
        const images = await Image.find();
        res.json(images);
      } catch (err) {
        res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
      }
    }
}
const imageDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await Image.findByIdAndRemove(id);
    res.json({ message: 'Image eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el image' });
  }
};
module.exports = {
    imagePost,
    imageGet,
    //imagePut,
    imageDelete
  };