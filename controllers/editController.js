const Edit = require("../models/editModel");

const editPost = async (req, res) => {
  try {
    const { name, input, instruction, user, tags } = req.body;
    const model = "text-davinci-edit-001"

    const edit = new Edit({ name, model, input, instruction, user, tags });
    await edit.save();
    res.status(201).json({ message: 'Edit prompt registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering the Edit prompt' });
  }
}
const editGet = async (req, res) => {

  if (req.query && req.query.id) {
    Edit.findById(req.query.id, function (err, edit) {
      if (err) {
        res.status(404);
        console.log('error while queryting the teacher', err)
        res.json({ error: "Teacher doesnt exist" })
      }
      res.json(edit);
    });
  } else {
    try {
      const edits = await Edit.find();
      res.json(edits);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
    }
  }
}
const editDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await Edit.findByIdAndRemove(id);
    res.json({ message: 'Edit eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el edit' });
  }
};

module.exports = {
  editPost,
  editGet,
  //editPut,
  editDelete
};