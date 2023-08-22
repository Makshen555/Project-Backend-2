const { Configuration, OpenAIApi } = require("openai");

// Configura la API key de OpenAI usando la clave almacenada en la variable de entorno OPENAI_KEY
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

/**
 * @param {*} req
 * @param {*} res
 */
const createCompletions = async (req, res) => {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.prompt,
        temperature: 0,
    });

    if (response) {
        res.status(201);
        res.json(response.data);
    } else {
        res.status(422);
        res.json({
            message: "Error al realizar el Completion",
        });
    }
};

/**
 * @param {*} req
 * @param {*} res
 */
const createEdit = async (req, res) => {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createEdit({
        model: "text-davinci-edit-001",
        input: req.body.input,
        instruction: req.body.instruction,
    });

    if (response) {
        res.status(201);
        res.json(response.data);
    } else {
        res.status(422);
        res.json({
            message: "Error al realizar el EDIT",
        });
    }
};

/**
 * Crea una imagen mediante la API de OpenAI.
 *
 * @param {*} req - Objeto de solicitud de Express.
 * @param {*} res - Objeto de respuesta de Express.
 */
const createImage = async (req, res) => {
    const { OpenAIApi } = require("openai");
    const openai = new OpenAIApi(configuration);
    const response = await openai.createImage({
        prompt: req.body.prompt,
        n: 1,
        size: req.body.size,
    });

    if (response) {
        res.status(201);
        res.json(response.data);
    } else {
        res.status(422);
        res.json({
            message: "Error al realizar la imagen",
        });
    }
};

module.exports = {
    createCompletions,
    createEdit,
    createImage,
};