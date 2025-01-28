const Lead = require("../models/lead");

const LeadController = {
  // Get all leads for a buyer
  async getLeads(req, res) {
    try {
      const leads = await Lead.findAll({
        where: { user_id: req.user.id }, // Assuming user ID is passed in the request
      });
      return res.status(200).json(leads);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching leads" });
    }
  },

  // Manage lead status (update progress)
  async manageLeads(req, res) {
    try {
      const { lead_id, status, interaction } = req.body;

      const lead = await Lead.findByPk(lead_id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Update lead status and interaction log
      lead.lead_status = status;
      if (interaction) {
        lead.interaction.push(interaction); // Assuming interaction is an object to be added to the array
      }

      await lead.save();
      return res.status(200).json(lead);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating lead" });
    }
  },

  // Get details of a specific lead
  async getLeadDetails(req, res) {
    try {
      const { lead_id } = req.params;
      const lead = await Lead.findByPk(lead_id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      return res.status(200).json(lead);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching lead details" });
    }
  },
};

module.exports = LeadController;
