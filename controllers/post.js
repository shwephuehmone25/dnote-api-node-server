exports.getAllPost = (req, res, next) => {
  res.status(200).json([
    {
      id: 1,
      title: "Learn English with an online course",
      description:
        "Our highly qualified English teachers are by your side and provide you with the right tools to help you interact confidently in the real world and achieve the professional and personal success you are working towards",
    },
  ]);
};

exports.createPost = (req, res, next) => {
  res.status(201).json([
    {
      message: "Post is created successfully",
      data: req.body,
    },
  ]);
}
