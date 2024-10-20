const db = require("../models");


// create
async function create(req, res) {
  if (!req.files || !req.files.hello) return res.status(400).send("No file uploaded.")

  const uploadedFile = req.files.hello;

  if (!uploadedFile.mimetype.startsWith("image/png")) return res.status(400).send("Uploaded file is not a PNG image.")

  const newName = "wb2c0-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + ".png"

  try {
     await uploadedFile.mv(`./uploads/${newName}`)

    const tmp = {
      name: req.body.name,
      description: req.body.description,
      github: req.body.github,
      image: `uploads/${newName}`,
      technologies: {"tech": req.body.technologies}
    }

    const result = await db.Project.create(tmp)

    res.send(result)

  } catch (e) {
    res.status(500).json({error: e})
  }


}

// delete
async function destroy(req, res) {
  const { id } = req.params;
  const result = await db.Project.findOne({ where: { id } })

  if (!result) return res.status(404).json({ error: "project not found" })
  result.destroy();
  res.status(200).json({ message: "project delete successfully" })
}

// update
async function update(req, res) {
  const { id } = req.params;

  try {
    const result = await db.Project.findByPk(id);

    if (!result) return res.status(404).json({ error: "Project not found" })
    if (!req.files || !req.files.hello) return res.status(400).json({error: "No file uploaded"})

    const uploadedFile = req.files.hello;

    if (!uploadedFile.mimetype.startsWith("image/png")) return res.status(400).json({error: "Uploaded file is not an image"})

    const newName = "wb2c0-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + ".png";
    await uploadedFile.mv(`./uploads/${newName}`);

    const updatedData = {
      name: req.body.name || result.name,
      description: req.body.description || result.description,
      image: `uploads/${newName}`,
      technologies: req.body.technologies ? { "tech": req.body.technologies } : result.technologies,
    };

    await result.update(updatedData);

    res.status(200).json({ message: "Project Edited Successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get One
async function getOne(req, res) {
  const { id } = req.params
  const result = await db.Project.findOne({where: { id }})

  if (!result) return res.status(404).json({error: "project not found"})
    
  res.status(200).send(result)
}


// show All
async function index(req, res) {
  const projects = await db.Project.findAll()
  
  res.send(projects)
}


// exports
module.exports = {
  index,
  create,
  destroy,
  getOne,
  update
};
