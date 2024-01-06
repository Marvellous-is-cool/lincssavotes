const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const connection = require("../../models/connection");
const paystack = require("paystack")(`${process.env.PAYSTACK_SECRET_KEY}`);

// Function to get selected contestant details
async function getSelectedContestant(nickname) {
  return await clientController.getContestantByNickname(nickname);
}

// Endpoint to fetch Paystack authentication URL
router.post("/:nickname/payment/get-url", async (req, res) => {
  try {
    const nickname = req.params.nickname; // Assuming you send the nickname in the request body
    const selectedContestant = await getSelectedContestant(nickname);

    // Initialize Paystack transaction details
    const paystackTransactionDetails = {
      email: req.body.email,
      amount: 5000, // Modify the amount as needed
      reference: `vote_${selectedContestant.nickname}_${Date.now()}`.replace(
        /[^\w_]/g,
        ""
      ),
      currency: "NGN", // Modify the currency
      callback: `https://bashvoting.onrender.com/payment/callback`,
    };

    // Use the paystack library to initialize the transaction
    const paystackResponse = await paystack.transaction.initialize(
      paystackTransactionDetails
    );

    if (paystackResponse.status && paystackResponse.status === true) {
      // Send Paystack authentication URL to the client side
      res.status(200).json({
        authorization_url: paystackResponse.data.authorization_url,
      });
    } else {
      console.error("Invalid Paystack response:", paystackResponse);
      res.status(500).json({ error: "Invalid Paystack Response" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Callback endpoint to handle Paystack callback
router.get("/payment/callback", async (req, res) => {
  try {
    console.log("Paystack Callback Request Received:", req.query);
    const nickname = req.body.nickname;
    const selectedContestant = await getSelectedContestant(nickname);

    const transactionReference = req.query.reference;

    // Use the paystack library to verify the transaction
    const verifyResponse = await paystack.transaction.verify(
      transactionReference
    );

    if (
      verifyResponse.status &&
      verifyResponse.status === true &&
      verifyResponse.data.currency === "NGN"
    ) {
      // Process the successful payment
      const updatePaymentQuery =
        'UPDATE payments SET status = "success" WHERE transaction_reference = ?';
      await connection.query(updatePaymentQuery, [transactionReference]);

      // Increment votes for the contestant
      await incrementVotesForContestant(selectedContestant.id);

      const fetchPaymentQuery =
        "SELECT * FROM payments WHERE transaction_reference = ?";
      const [paymentDetails] = await connection.query(fetchPaymentQuery, [
        transactionReference,
      ]);

      if (paymentDetails.length > 0) {
        // Redirect to the success page with appropriate query parameters
        res.render("voteNowSuccess", {
          selectedContestant,
          status: "success",
        });
      } else {
        res.render("voteNowSuccess", {
          selectedContestant,
          status: "invalid",
        });
      }
    } else {
      // Process the failed payment
      const updatePaymentQuery =
        'UPDATE payments SET status = "failed" WHERE transaction_reference = ?';
      await connection.query(updatePaymentQuery, [transactionReference]);

      // Redirect to the failure page with appropriate query parameters
      res.render("voteNowSuccess", {
        selectedContestant,
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Error processing Paystack callback:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
