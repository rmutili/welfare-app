import Contribution from "../models/contributionModel.js";
import Event from "../models/eventModel.js";

// Create a new contribution
const createContribution = async (req, res) => {
  const { event, user, amount, paymentMethod, transactionId } = req.body;

  try {
    const contribution = new Contribution({
      event,
      user: user,
      amount,
      paymentMethod,
      transactionId
    });

    const createdContribution = await contribution.save();

    // Update the event's contributions array
    await Event.findByIdAndUpdate(event, {
      $push: { contributions: createdContribution._id }
    });

    // Populate the user and event details
    await createdContribution
      .populate("user", "name")
      .populate("event", "name")
      .execPopulate();

    res.status(201).json(createdContribution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all contributions
const getAllContributions = async (req, res) => {
  const contributions = await Contribution.find({})
    .populate("user", "name")
    .populate("event", "name");

  res.json(contributions);
};

// Get all contributions for an event
const getContributionsByEvent = async (req, res) => {
  const contributions = await Contribution.find({ event: req.params.eventId })
    .populate("user", "name")
    .populate("event", "name");

  res.json(contributions);
};

// Get a single contribution by ID
const getContributionById = async (req, res) => {
  const contribution = await Contribution.findById(req.params.id)
    .populate("user", "name")
    .populate("event", "name");

  if (contribution) {
    res.json(contribution);
  } else {
    res.status(404).json({ message: "Contribution not found" });
  }
};

// Update a contribution
const updateContribution = async (req, res) => {
  const { amount, paymentMethod, transactionId, status } = req.body;

  const contribution = await Contribution.findById(req.params.id);

  if (contribution) {
    contribution.amount = amount || contribution.amount;
    contribution.paymentMethod = paymentMethod || contribution.paymentMethod;
    contribution.transactionId = transactionId || contribution.transactionId;
    contribution.status = status || contribution.status;

    const updatedContribution = await contribution.save();
    res.json(updatedContribution);
  } else {
    res.status(404).json({ message: "Contribution not found" });
  }
};

// Delete a contribution
const deleteContribution = async (req, res) => {
  const contribution = await Contribution.findById(req.params.id);

  if (contribution) {
    await contribution.remove();
    res.json({ message: "Contribution removed" });
  } else {
    res.status(404).json({ message: "Contribution not found" });
  }
};

export {
  createContribution,
  getAllContributions,
  getContributionsByEvent,
  getContributionById,
  updateContribution,
  deleteContribution
};
