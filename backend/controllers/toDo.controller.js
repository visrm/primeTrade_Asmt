import User from "../models/user.model.js";
import ToDo from "../models/toDo.model.js";

export const createToDo = async (req, res) => {
  try {
    const { title } = req.body;
    let { description, deadline, status = "pending" } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    if (!title)
      return res.status(400).json({
        message: "ToDo requires a title.",
        success: false,
      });

    const statuses = ["pending", "success", "failure", "expired"];
    if (!statuses.includes(status?.toString()))
      return res.status(400).json({
        message: "Provide valid status defined.",
        success: false,
      });

    const newToDo = await ToDo.create({
      user: userId,
      title,
      description,
      deadline,
      status,
    });

    if (!newToDo)
      return res.status(404).json({
        message: "ToDo NOT created",
        success: false,
      });

    return res.status(201).json({
      message: "ToDo created successfully!",
      newToDo,
      success: true,
    });
  } catch (error) {
    console.log("Error in createToDo: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const updateToDo = async (req, res) => {
  try {
    let { title, description, deadline } = req.body;
    const { id } = req.params;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    if (!id)
      return res.status(400).json({
        message: "Provide a valid ToDo Id.",
        success: false,
      });

    let toDo = await ToDo.findById(id);
    if (!toDo)
      return res.status(404).json({
        message: "ToDo not found.",
        success: false,
      });

    let cantUpdateToDo = toDo.user.toString() !== userId.toString();
    if (cantUpdateToDo)
      return res.status(401).json({
        message: "Unauthorized to delete ToDo.",
        success: false,
      });

    toDo.title = title || toDo.title;
    toDo.description = description || toDo.description;
    toDo.deadline = deadline || toDo.deadline;

    toDo = await toDo.save();

    return res.status(200).json({
      message: "ToDo updated successfully.",
      toDo,
      success: true,
    });
  } catch (error) {
    console.log("Error in updateToDo: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const updateToDoStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    if (!id)
      return res.status(400).json({
        message: "Provide a valid ToDo Id.",
        success: false,
      });

    let toDo = await ToDo.findById(id);
    if (!toDo)
      return res.status(404).json({
        message: "ToDo not found.",
        success: false,
      });

    let cantUpdateToDoStatus = toDo.user.toString() !== userId.toString();
    if (cantUpdateToDoStatus)
      return res.status(401).json({
        message: "Unauthorized to delete ToDo.",
        success: false,
      });

    const statuses = ["pending", "success", "failure", "expired"];
    if (!statuses.includes(status.toString()))
      return res.status(400).json({
        message: "Provide valid status defined.",
        success: false,
      });

    toDo.status = status || toDo.status;

    toDo = await toDo.save();

    return res.status(200).json({
      message: "ToDo status updated successfully.",
      toDo,
      success: true,
    });
  } catch (error) {
    console.log("Error in updateToDoStatus: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const deleteToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    if (!id)
      return res.status(400).json({
        message: "Provide a valid ToDo Id.",
        success: false,
      });

    const toDo = await ToDo.findById(id);
    if (!toDo)
      return res.status(404).json({
        message: "ToDo not found.",
        success: false,
      });

    let cantDeleteToDo = toDo.user.toString() !== userId.toString();
    if (cantDeleteToDo)
      return res.status(401).json({
        message: "Unauthorized to delete ToDo.",
        success: false,
      });

    await ToDo.findByIdAndDelete(id);
    return res.status(200).json({
      message: "ToDo deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.log("Error in deleteToDo: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const getUserToDos = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    const keyword = req.query.keyword || "";
    const toDos = await ToDo.find({
      user: user._id,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      });

    const datetime = new Date();
    for (const todo of toDos) {
      const todoDeadline = new Date(todo.deadline);
      if (todoDeadline < datetime) {
        const updateStatus = await ToDo.findByIdAndUpdate(todo._id, {
          status: "expired",
        });
        await Promise.all([updateStatus]);
      }
    }

    return res.status(200).json({
      message: "ToDos fetched successfully",
      toDos,
      success: true,
    });
  } catch (error) {
    console.log("Error in getUserToDos: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const getToDos = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const toDos = await ToDo.find(query).sort({ createdAt: -1 }).populate({
      path: "user",
      select: "-password",
    });

    if (toDos.length === 0)
      return res.status(200).json({
        message: "No ToDos' available",
        toDos: [],
        success: true,
      });

    return res.status(200).json({
      message: "ToDos fetched successfully",
      toDos,
      success: true,
    });
  } catch (error) {
    console.log("Error in getToDos: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};
