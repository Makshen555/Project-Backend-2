const Completion = require("../models/completionModel");

const completionPost = async (req, res) => {
  try {
      const { name, prompt, user, tags } = req.body; // Agregamos "tags" al destructuring
      const model = "text-davinci-edit-003";
      const temperature = 0;

      const completion = new Completion({ name, model, prompt, temperature, user, tags }); // Pasamos las etiquetas al constructor
      await completion.save();
      res.status(201).json({ message: 'Completion prompt registered successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Error registering the Completion prompt' });
  }
};
const completionGet = async (req, res) => {
  if (req.query && req.query.id) {
      Completion.findById(req.query.id, function (err, completion) {
          if (err) {
              res.status(404);
              console.log('Error while querying the completion', err);
              res.json({ error: "Completion doesn't exist" });
          } else {
              res.json(completion);
          }
      });
  } else {
      try {
          const completions = await Completion.find();
          res.json(completions);
      } catch (err) {
          res.status(500).json({ message: 'Error getting list of completions' });
      }
  }
};
const completionDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await Completion.findByIdAndRemove(id);
    res.json({ message: 'Completion successfully removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing completion' });
  }
};
module.exports = {
    completionPost,
    completionGet,
    //editPut,
    completionDelete
  };