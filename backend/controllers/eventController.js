import Event from "../models/eventModel.js";

// Create a new event
const createEvent = async (req, res) => {
  const { name, description, date, location } = req.body;

  const event = new Event({
    name,
    description,
    date,
    location,
    createdBy: req.user._id
  });

  const createdEvent = await event.save();

  res.status(201).json(createdEvent);
};

// Get all events
const getEvents = async (req, res) => {
  const events = await Event.find({}).populate("createdBy", "name");

  res.json(events);
};

// Get a single event
const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("createdBy", "name")
    .populate("contributions");

  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
};

export { createEvent, getEvents, getEventById };
