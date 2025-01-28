const RFQ = require("../models/rfq");
const User = require("../models/user");
const Lead = require("../models/lead");

// Search RFQs (for Buyers)
const searchRFQs = async (req, res) => {
  const { searchTerm, status } = req.query;

  try {
    const rfqs = await RFQ.findAll({
      where: {
        status: status || "pending",
        [Op.or]: [
          {
            "$products.name$": {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ],
      },
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["name", "email"],
        },
      ],
    });

    if (!rfqs.length) {
      return res.status(404).json({ message: "No RFQs found" });
    }

    res.status(200).json(rfqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get RFQ Details (for both Buyers and Manufacturers)
const getRFQDetails = async (req, res) => {
  const { rfqId } = req.params;

  try {
    const rfq = await RFQ.findByPk(rfqId, {
      include: [
        { model: User, as: "buyer" },
        { model: User, as: "manufacturer" },
      ],
    });

    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    res.status(200).json(rfq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create RFQ (For Buyers only)
const createRFQ = async (req, res) => {
  const { leadId, products } = req.body;
  const buyerId = req.user.id; // Assuming the user is authenticated

  try {
    const newRFQ = await RFQ.create({
      lead_id: leadId,
      products,
      buyers_details: buyerId,
      rfq_date: new Date(),
    });

    res.status(201).json({ message: "RFQ created successfully", rfq: newRFQ });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit RFQ (For Buyers only)
const editRFQ = async (req, res) => {
  const { rfqId } = req.params;
  const { products } = req.body;
  const buyerId = req.user.id; // Assuming the user is authenticated

  try {
    const rfq = await RFQ.findOne({
      where: { rfq_id: rfqId, buyers_details: buyerId },
    });

    if (!rfq) {
      return res
        .status(404)
        .json({ message: "RFQ not found or you're not authorized" });
    }

    // Update RFQ fields
    rfq.products = products || rfq.products;

    await rfq.save();

    res.status(200).json({ message: "RFQ updated successfully", rfq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manage Leads (For Buyers only)
const manageLeads = async (req, res) => {
  const { leadId } = req.params;
  const buyerId = req.user.id; // Assuming the user is authenticated

  try {
    const rfqs = await RFQ.findAll({
      where: { lead_id: leadId, buyers_details: buyerId },
    });

    if (!rfqs.length) {
      return res.status(404).json({ message: "No leads found" });
    }

    res.status(200).json(rfqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// View RFQ (For Manufacturers only)
const viewRFQ = async (req, res) => {
  const { rfqId } = req.params;

  try {
    const rfq = await RFQ.findByPk(rfqId, {
      include: [
        { model: User, as: "buyer" },
        { model: User, as: "manufacturer" },
      ],
    });

    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    res.status(200).json(rfq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit Quotation (For Manufacturers only)
const submitQuotation = async (req, res) => {
  const { rfqId, quotation } = req.body;
  const manufacturerId = req.user.id; // Assuming the user is authenticated

  try {
    const rfq = await RFQ.findOne({
      where: { rfq_id: rfqId, manufacturer_id: manufacturerId },
    });

    if (!rfq) {
      return res
        .status(404)
        .json({ message: "RFQ not found or you're not authorized" });
    }

    // Submit the quotation
    rfq.manufacturerResponse = quotation || rfq.manufacturerResponse;
    rfq.status = "quoted"; // Change the status to "quoted"

    await rfq.save();

    res.status(200).json({ message: "Quotation submitted successfully", rfq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Quotation (For Manufacturers only)
const updateQuotation = async (req, res) => {
  const { rfqId, quotation } = req.body;
  const manufacturerId = req.user.id; // Assuming the user is authenticated

  try {
    const rfq = await RFQ.findOne({
      where: { rfq_id: rfqId, manufacturer_id: manufacturerId },
    });

    if (!rfq) {
      return res
        .status(404)
        .json({ message: "RFQ not found or you're not authorized" });
    }

    // Update the quotation
    rfq.manufacturerResponse = quotation || rfq.manufacturerResponse;

    await rfq.save();

    res.status(200).json({ message: "Quotation updated successfully", rfq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manage RFQs (For Manufacturers only)
const manageRFQs = async (req, res) => {
  const manufacturerId = req.user.id; // Assuming the user is authenticated

  try {
    const rfqs = await RFQ.findAll({
      where: { manufacturer_id: manufacturerId },
    });

    if (!rfqs.length) {
      return res.status(404).json({ message: "No RFQs found" });
    }

    res.status(200).json(rfqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  searchRFQs,
  getRFQDetails,
  createRFQ,
  editRFQ,
  manageLeads,
  viewRFQ,
  submitQuotation,
  updateQuotation,
  manageRFQs,
};
